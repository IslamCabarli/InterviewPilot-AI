<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OllamaProvider implements AiProviderInterface
{
    private string $baseUrl;
    private string $model;
    private int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.ollama.url');
        $this->model = config('services.ollama.model');
        $this->timeout = config('services.ollama.timeout');
    }

    public function chat(string $systemPrompt, array $messages): string
    {
        $payload = [
            'model' => $this->model,
            'messages' => [
                [
                    'role' => 'system',
                    'content' => $systemPrompt,
                ],
                ...$messages,
            ],
            'stream' => false,
        ];

        $response = Http::timeout($this->timeout)
            ->post("{$this->baseUrl}/api/chat", $payload);

        if ($response->failed()) {
            throw new RuntimeException(
                'Ollama API error: ' . $response->body()
            );
        }

        return $response->json('message.content') ?? '';
    }
}