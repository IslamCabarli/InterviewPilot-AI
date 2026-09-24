<?php

namespace Database\Factories;

use App\Models\Interview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InterviewFactory extends Factory
{
    protected $model = Interview::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => 'backend',
            'difficulty' => 'medium',
            'status' => 'in_progress',
        ];
    }
}
