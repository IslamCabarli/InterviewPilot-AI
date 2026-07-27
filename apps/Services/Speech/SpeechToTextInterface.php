<?php

namespace App\Services\Speech;

use Illuminate\Http\UploadedFile;

interface SpeechToTextInterface
{
    public function transcribe(UploadedFile $audio): string;
}