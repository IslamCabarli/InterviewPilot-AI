<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'InterviewPilot AI API',
    version: '1.0.0',
    description: 'AI-powered mock interview platform API'
)]
#[OA\Server(
    url: 'http://127.0.0.1:8000/api',
    description: 'Local development server'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
)]
abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;
}
