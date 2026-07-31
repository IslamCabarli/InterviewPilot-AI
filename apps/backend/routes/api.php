<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\SpeechController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Broadcast::routes(['middleware' => ['auth:sanctum']]);
    });
});

/*
|--------------------------------------------------------------------------
| Interview Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')
    ->prefix('interviews')
    ->group(function () {
        Route::post('/', [InterviewController::class, 'start']);
        Route::get('/{interview}', [InterviewController::class, 'show']);
        Route::post('/{interview}/answer', [InterviewController::class, 'answer']);
        Route::post('/{interview}/complete', [InterviewController::class, 'complete']);
    });

/*
|--------------------------------------------------------------------------
| Speech Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')
    ->prefix('speech')
    ->group(function () {
        Route::post('/transcribe', [SpeechController::class, 'transcribe']);
        Route::post('/synthesize', [SpeechController::class, 'synthesize']);
    });

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/ping', function () {
            return response()->json([
                'message' => 'Salam, admin!',
            ]);
        });
    });
