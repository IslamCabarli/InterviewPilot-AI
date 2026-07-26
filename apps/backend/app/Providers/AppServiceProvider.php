<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Ai\AiProviderInterface;
use App\Services\Ai\OllamaProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AiProviderInterface::class, OllamaProvider::class);
    }

    public function boot(): void
    {
        //
    }
}
