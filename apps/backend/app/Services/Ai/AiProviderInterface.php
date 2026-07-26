<?php

namespace App\Services\Ai;

interface AiProviderInterface
{
    /**
     * Sistem prompt-u və mesaj tarixçəsini göndərib tam AI cavabını alır (sinxron).
     *
     * @param array<int, array{role: string, content: string}> $messages
     */
    public function chat(string $systemPrompt, array $messages): string;

    /**
     * Eyni sorğunu stream şəklində göndərir, hər token/parça gələn kimi
     * $onChunk callback-inə ötürür. Real-time "yazır" effekti üçün istifadə olunur.
     *
     * @param array<int, array{role: string, content: string}> $messages
     * @param callable(string $chunk): void $onChunk
     */
    public function streamResponse(string $systemPrompt, array $messages, callable $onChunk): void;
}