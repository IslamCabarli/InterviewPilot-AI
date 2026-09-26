<?php

namespace App\Providers;

use App\Services\Ai\AiProviderInterface;
use App\Services\Ai\OllamaProvider;
use App\Services\Speech\FasterWhisperProvider;
use App\Services\Speech\PiperProvider;
use App\Services\Speech\SpeechToTextInterface;
use App\Services\Speech\TextToSpeechInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // AI Provider
        $this->app->bind(AiProviderInterface::class, function () {
            return match (config('services.ai_provider', 'ollama')) {
                'ollama' => new OllamaProvider,
                default => new OllamaProvider,
            };
        });

        // Speech-to-Text Provider
        $this->app->bind(SpeechToTextInterface::class, function () {
            return match (config('services.stt_provider', 'whisper')) {
                'whisper' => new FasterWhisperProvider,
                default => new FasterWhisperProvider,
            };
        });

        // Text-to-Speech Provider
        $this->app->bind(TextToSpeechInterface::class, function () {
            return match (config('services.tts_provider', 'piper')) {
                'piper' => new PiperProvider,
                default => new PiperProvider,
            };
        });
    }

    public function boot(): void
    {
        //
    }
}
