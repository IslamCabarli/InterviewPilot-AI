<?php

namespace App\Services\Ai;

interface AiProviderInterface
{
    /**
     * Sistem prompt-u və mesaj tarixçəsini göndərib AI-dan cavab alır.
     *
     * @param string $systemPrompt
     * @param array<int, array{role: string, content: string}> $messages
     * @return string
     */
    public function chat(string $systemPrompt, array $messages): string;
}