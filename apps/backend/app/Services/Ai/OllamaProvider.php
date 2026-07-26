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
                ['role' => 'system', 'content' => $systemPrompt],
                ...$messages,
            ],
            'stream' => false,
        ];

        $response = Http::timeout($this->timeout)
            ->post("{$this->baseUrl}/api/chat", $payload);

        if ($response->failed()) {
            throw new RuntimeException('Ollama API error: '.$response->body());
        }

        return $response->json('message.content') ?? '';
    }

    public function streamResponse(string $systemPrompt, array $messages, callable $onChunk): void
    {
        $payload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ...$messages,
            ],
            'stream' => true,
        ];

        $response = Http::timeout($this->timeout)
            ->withOptions(['stream' => true])
            ->post("{$this->baseUrl}/api/chat", $payload);

        if ($response->failed()) {
            throw new RuntimeException('Ollama API error: '.$response->body());
        }

        $body = $response->toPsrResponse()->getBody();
        $buffer = '';

        while (! $body->eof()) {
            $buffer .= $body->read(1024);

            // Ollama hər sətri ayrıca JSON obyekt kimi göndərir (NDJSON)
            while (($newlinePos = strpos($buffer, "\n")) !== false) {
                $line = substr($buffer, 0, $newlinePos);
                $buffer = substr($buffer, $newlinePos + 1);

                if (trim($line) === '') {
                    continue;
                }

                $decoded = json_decode($line, true);
                $chunk = $decoded['message']['content'] ?? null;

                if ($chunk !== null && $chunk !== '') {
                    $onChunk($chunk);
                }

                if (($decoded['done'] ?? false) === true) {
                    return;
                }
            }
        }
    }
}
