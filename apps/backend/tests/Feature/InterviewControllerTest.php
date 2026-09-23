<?php

namespace Tests\Feature;

use App\Models\Answer;
use App\Models\Interview;
use App\Models\Question;
use App\Models\User;
use App\Services\Ai\AiProviderInterface;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Fakes\FakeAiProvider;
use Tests\TestCase;

class InterviewControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        // Bütün testlərdə default olaraq saxta AI provider işlədilir —
        // real Ollama-ya heç bir sorğu getmir.
        $this->app->bind(AiProviderInterface::class, fn() => new FakeAiProvider());
    }

    private function authenticatedUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        return $user;
    }

    public function test_authenticated_user_can_start_an_interview(): void
    {
        $user = $this->authenticatedUser();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/interviews', [
            'type' => 'backend',
            'difficulty' => 'medium',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'interview' => ['id', 'type', 'difficulty', 'status'],
                'question' => ['id', 'content'],
            ]);

        $this->assertDatabaseHas('interviews', [
            'user_id' => $user->id,
            'type' => 'backend',
            'difficulty' => 'medium',
            'status' => 'in_progress',
        ]);

        $this->assertDatabaseHas('questions', [
            'content' => 'Bu, süni test cavabıdır.',
            'order' => 1,
        ]);
    }

    public function test_guest_cannot_start_an_interview(): void
    {
        $response = $this->postJson('/api/interviews', [
            'type' => 'backend',
            'difficulty' => 'medium',
        ]);

        $response->assertStatus(401);
    }

    public function test_starting_an_interview_requires_valid_difficulty(): void
    {
        $user = $this->authenticatedUser();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/interviews', [
            'type' => 'backend',
            'difficulty' => 'impossible', // enum-a uyğun deyil
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['difficulty']);
    }
}
