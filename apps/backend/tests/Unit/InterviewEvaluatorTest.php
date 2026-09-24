<?php

namespace Tests\Unit;

use App\Models\Interview;
use App\Models\Question;
use App\Models\User;
use App\Services\Ai\EvaluationPromptBuilder;
use App\Services\Ai\InterviewEvaluator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\Fakes\FakeAiProvider;
use Tests\TestCase;

class InterviewEvaluatorTest extends TestCase
{
    use RefreshDatabase;

    private function makeInterviewWithTranscript(): Interview
    {
        $user = User::factory()->create();
        $interview = Interview::factory()->create(['user_id' => $user->id]);

        Question::create([
            'interview_id' => $interview->id,
            'content' => 'Laravel-də dependency injection nədir?',
            'order' => 1,
        ]);

        return $interview;
    }

    public function test_parses_clean_json_response(): void
    {
        $rawJson = json_encode([
            'overall_score' => 82,
            'score_breakdown' => [
                'technical' => 22,
                'communication' => 18,
                'confidence' => 14,
                'problem_solving' => 16,
                'best_practices' => 12,
            ],
            'summary' => 'Güclü texniki bilik.',
            'weak_points' => ['Testing'],
            'strong_points' => ['Architecture'],
            'recommended_topics' => ['TDD'],
        ]);

        $evaluator = new InterviewEvaluator(
            new FakeAiProvider($rawJson),
            new EvaluationPromptBuilder(),
        );

        $interview = $this->makeInterviewWithTranscript();
        $report = $evaluator->evaluate($interview);

        $this->assertSame('Güclü texniki bilik.', $report->summary);
        $this->assertSame(['Testing'], $report->weak_points);
        $this->assertSame(82, $interview->fresh()->overall_score);
    }
    public function test_parses_json_wrapped_in_markdown_code_fence(): void
    {
        $rawJson = "```json\n" . json_encode([
                'overall_score' => 70,
                'score_breakdown' => ['technical' => 18, 'communication' => 16, 'confidence' => 12, 'problem_solving' => 14, 'best_practices' => 10],
                'summary' => 'Orta səviyyə.',
                'weak_points' => [],
                'strong_points' => [],
                'recommended_topics' => [],
            ]) . "\n```";

        $evaluator = new InterviewEvaluator(
            new FakeAiProvider($rawJson),
            new EvaluationPromptBuilder(),
        );

        $interview = $this->makeInterviewWithTranscript();
        $report = $evaluator->evaluate($interview);

        $this->assertSame('Orta səviyyə.', $report->summary);
        $this->assertSame(70, $interview->fresh()->overall_score);
    }


}
