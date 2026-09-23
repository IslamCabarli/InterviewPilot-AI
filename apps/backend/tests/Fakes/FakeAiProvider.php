<?php

namespace Tests\Fakes;

use App\Services\Ai\AiProviderInterface;

class FakeAiProvider implements AiProviderInterface
{
    public function __construct(
        private readonly string $fixedResponse = 'Bu, süni test cavabıdır.',
    ) {}

    public function chat(string $systemPrompt, array $messages): string
    {
        return $this->fixedResponse;
    }

    public function streamResponse(string $systemPrompt, array $messages, callable $onChunk): void
    {
        $onChunk($this->fixedResponse);
    }
}
