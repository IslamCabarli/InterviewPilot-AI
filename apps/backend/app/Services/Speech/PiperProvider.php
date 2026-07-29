<?php

namespace App\Services\Speech;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class PiperProvider implements TextToSpeechInterface
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.piper.url');
    }

    public function synthesize(string $text): string
    {
        $response = Http::timeout(30)
            ->post("{$this->baseUrl}/synthesize", ['text' => $text]);

        if ($response->failed()) {
            throw new RuntimeException('Piper API error: ' . $response->body());
        }

        return $response->body();
    }
}