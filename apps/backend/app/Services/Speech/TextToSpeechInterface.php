<?php

namespace App\Services\Speech;

interface TextToSpeechInterface
{
    /**
     * Mətni səsə çevirir, ham audio (WAV) məlumatını qaytarır.
     */
    public function synthesize(string $text): string;
}