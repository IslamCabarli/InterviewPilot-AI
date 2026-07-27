<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Speech\SpeechToTextInterface;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SpeechController extends Controller
{
    public function __construct(
        private readonly SpeechToTextInterface $stt,
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
}