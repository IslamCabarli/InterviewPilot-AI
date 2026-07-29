<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Speech\SpeechToTextInterface;
use App\Services\Speech\TextToSpeechInterface;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SpeechController extends Controller
{   
    public function __construct(
        private readonly SpeechToTextInterface $stt,
        private readonly TextToSpeechInterface $tts,
    ) {}

    #[OA\Post(
        path: '/speech/transcribe',
        summary: 'Səs faylını mətnə çevir',
        tags: ['Speech'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Transkripsiya edilmiş mətn'),
        ]
    )]
    public function transcribe(Request $request)
    {
        $request->validate([
            'audio' => ['required', 'file', 'max:20480'], // max 20MB
        ]);

        $text = $this->stt->transcribe($request->file('audio'));

        return response()->json(['text' => $text]);
    }


    #[OA\Post(
    path: '/speech/synthesize',
    summary: 'Mətni səsə çevir',
    tags: ['Speech'],
    security: [['bearerAuth' => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['text'],
            properties: [new OA\Property(property: 'text', type: 'string')]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: 'WAV audio faylı'),
    ]
)]
public function synthesize(Request $request)
{
    $validated = $request->validate([
        'text' => ['required', 'string', 'max:2000'],
    ]);

    $audio = $this->tts->synthesize($validated['text']);

    return response($audio, 200)->header('Content-Type', 'audio/wav');
}
}