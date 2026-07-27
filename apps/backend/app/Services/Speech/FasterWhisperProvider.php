<?php

namespace App\Services\Speech;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class FasterWhisperProvider implements SpeechToTextInterface
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.whisper.url');
    }

    public function transcribe(UploadedFile $audio): string
    {
        $response = Http::timeout(60)
            ->attach('file', file_get_contents($audio->getRealPath()), $audio->getClientOriginalName())
            ->post("{$this->baseUrl}/transcribe");

        if ($response->failed()) {
            throw new RuntimeException('Whisper API error: ' . $response->body());
        }

        return $response->json('text') ?? '';
    }
}