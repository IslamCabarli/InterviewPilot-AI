<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InterviewController;
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