<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Question;
use App\Models\Answer;
use App\Services\Ai\AiProviderInterface;
use App\Services\Ai\ConversationBuilder;
use App\Services\Ai\InterviewPromptBuilder;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class InterviewController extends Controller
{
    public function __construct(
        private readonly AiProviderInterface $aiProvider,
        private readonly InterviewPromptBuilder $promptBuilder,
        private readonly ConversationBuilder $conversationBuilder,

    ) {}


    #[OA\Post(
        path: '/interviews',
        summary: 'Start new interview',
        tags: ['Interviews'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['type', 'difficulty'],
                properties: [
                    new OA\Property(property: 'type', type: 'string', example: 'backend'),
                    new OA\Property(property: 'difficulty', type: 'string', example: 'medium'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'The interview has started; the first question is being relayed.')
        ]
    )]

    public function start( Request $request )
    {
        $validated = $request->validate([
            'type' => ['required', 'string'],
            'difficulty' => ['required', 'string', 'in:easy,medium,hard,senior'],
        ]);
        $interview = Interview::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'difficulty' => $validated['difficulty'],
            'status' => 'in_progress',
            'started_at' => now(),
        ]); 
    

        $systemPrompt = $this->promptBuilder->build($validated['type'], $validated['difficulty']);

        // İlk mesaj — konuşmanı başlatmaq üçün AI-a boş "başla" tapşırığı veririk
        $aiResponse = $this->aiProvider->chat($systemPrompt, [
            ['role' => 'user', 'content' => 'Start the interview.']
        ]);

        $question = Question::create([
            'interview_id' => $interview->id,
            'content' => $aiResponse,
            'order' => 1,
        ]);

        return response()->json([
            'interview' => $interview,
            'question' => $question,
            ], 201);

    }   

     #[OA\Post(
        path: '/interviews/{interview}/answer',
        summary: 'Cavab göndər və növbəti sualı al',
        tags: ['Interviews'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'interview', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['question_id', 'content'],
                properties: [
                    new OA\Property(property: 'question_id', type: 'integer', example: 1),
                    new OA\Property(property: 'content', type: 'string', example: 'Mənim cavabım budur...'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Cavab qeydə alındı, növbəti sual qaytarıldı'),
        ]
    )]
    public function answer(Request $request, Interview $interview)
    {
        $this->authorizeInterview($request, $interview);

        $validated = $request->validate([
            'question_id' => ['required', 'exists:questions,id'],
            'content' => ['required', 'string'],
        ]);

        $question = Question::where('interview_id', $interview->id)
            ->findOrFail($validated['question_id']);

        Answer::create([
            'question_id' => $question->id,
            'content' => $validated['content'],
        ]);

        $systemPrompt = $this->promptBuilder->build($interview->type, $interview->difficulty);
        $conversation = $this->conversationBuilder->build($interview);

        $aiResponse = $this->aiProvider->chat($systemPrompt, $conversation);

        $nextQuestion = Question::create([
            'interview_id' => $interview->id,
            'content' => $aiResponse,
            'order' => $interview->questionCount() + 1,
        ]);

        return response()->json([
            'question' => $nextQuestion,
        ]);
    }

    #[OA\Post(
        path: '/interviews/{interview}/complete',
        summary: 'Müsahibəni tamamla',
        tags: ['Interviews'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'interview', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Müsahibə tamamlandı'),
        ]
    )]
    public function complete(Request $request, Interview $interview)
    {
        $this->authorizeInterview($request, $interview);

        $interview->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json(['interview' => $interview]);
    }

    #[OA\Get(
        path: '/interviews/{interview}',
        summary: 'Müsahibə detallarını al (bütün sual-cavablarla)',
        tags: ['Interviews'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'interview', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Müsahibə detalları'),
        ]
    )]
    public function show(Request $request, Interview $interview)
    {
        $this->authorizeInterview($request, $interview);

        $interview->load('questions.answer');

        return response()->json(['interview' => $interview]);
    }

    private function authorizeInterview(Request $request, Interview $interview): void
    {
        abort_if($interview->user_id !== $request->user()->id, 403, 'Bu müsahibəyə icazən yoxdur.');
    }


}