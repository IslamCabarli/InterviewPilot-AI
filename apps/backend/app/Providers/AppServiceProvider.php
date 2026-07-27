<?php

namespace App\Providers;

use App\Services\Ai\AiProviderInterface;
use App\Services\Ai\OllamaProvider;
use Illuminate\Support\ServiceProvider;
use App\Services\Speech\SpeechToTextInterface;
use App\Services\Speech\FasterWhisperProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AiProviderInterface::class, OllamaProvider::class);
        $this->app->bind(SpeechToTextInterface::class, FasterWhisperProvider::class);
    }

    public function boot(): void
    {
        //
    }
}
