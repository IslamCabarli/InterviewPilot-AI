<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OllamaProvider implements AiProviderInterface
{
    private string $baseUrl;

    private string $model;

    private int $timeout;

    private int $numCtx;

    private int $numPredict;

    private int $numPredictJson;

    private string $keepAlive;

    public function __construct()
    {
        $this->baseUrl = config('services.ollama.url');
        $this->model = config('services.ollama.model');
        $this->timeout = (int) config('services.ollama.timeout');
        $this->numCtx = (int) config('services.ollama.num_ctx', 4096);
        $this->numPredict = (int) config('services.ollama.num_predict', 300);
        $this->numPredictJson = (int) config('services.ollama.num_predict_json', 800);
        $this->keepAlive = (string) config('services.ollama.keep_alive', '30m');
    }

    public function chat(string $systemPrompt, array $messages, bool $json = false): string
    {
        $payload = $this->buildPayload($systemPrompt, $messages, stream: false, json: $json);

        $response = Http::timeout($this->timeout)
            ->post("{$this->baseUrl}/api/chat", $payload);

        if ($response->failed()) {
            throw new RuntimeException('Ollama API error: '.$response->body());
        }

        return $response->json('message.content') ?? '';
    }

    public function streamResponse(string $systemPrompt, array $messages, callable $onChunk): void
    {
        $payload = $this->buildPayload($systemPrompt, $messages, stream: true);

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

    /**
     * - num_ctx: kontekst pəncərəsi (system prompt + CV + söhbət tarixçəsi buraya sığmalıdır)
     * - num_predict: cavabın maksimum token sayı
     * - keep_alive: modeli GPU yaddaşında saxlayır
     * - format=json: qiymətləndirmə üçün yalnız etibarlı JSON qaytarır
     *
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<string, mixed>
     */
    private function buildPayload(string $systemPrompt, array $messages, bool $stream, bool $json = false): array
    {
        $payload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ...$messages,
            ],
            'stream' => $stream,
            'keep_alive' => $this->keepAlive,
            'options' => [
                'num_ctx' => $this->numCtx,
                'num_predict' => $json ? $this->numPredictJson : $this->numPredict,
                'temperature' => $json ? 0.2 : 0.6,
            ],
        ];

        if ($json) {
            $payload['format'] = 'json';
        }

        return $payload;
    }
}
