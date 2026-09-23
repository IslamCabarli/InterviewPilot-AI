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

    public function test_user_can_submit_an_answer_and_receive_next_question(): void
    {
        $user = $this->authenticatedUser();
        $interview = Interview::create([
            'user_id' => $user->id,
            'type' => 'backend',
            'difficulty' => 'medium',
            'status' => 'in_progress',
        ]);
        $question = Question::create([
            'interview_id' => $interview->id,
            'content' => 'İlk sual',
            'order' => 1,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/interviews/{$interview->id}/answer", [
                'question_id' => $question->id,
                'content' => 'Mənim cavabım budur.',
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['question' => ['id', 'content', 'order']]);

        $this->assertDatabaseHas('answers', [
            'question_id' => $question->id,
            'content' => 'Mənim cavabım budur.',
        ]);

        $this->assertDatabaseHas('questions', [
            'interview_id' => $interview->id,
            'order' => 2,
        ]);
    }

    public function test_user_cannot_answer_another_users_interview(): void
    {
        $owner = $this->authenticatedUser();
        $intruder = $this->authenticatedUser();

        $interview = Interview::create([
            'user_id' => $owner->id,
            'type' => 'backend',
            'difficulty' => 'medium',
            'status' => 'in_progress',
        ]);
        $question = Question::create([
            'interview_id' => $interview->id,
            'content' => 'İlk sual',
            'order' => 1,
        ]);

        $response = $this->actingAs($intruder, 'sanctum')
            ->postJson("/api/interviews/{$interview->id}/answer", [
                'question_id' => $question->id,
                'content' => 'İcazəsiz cavab',
            ]);

        $response->assertStatus(403);
    }

    public function test_completing_an_interview_generates_a_report(): void
    {
        $this->app->bind(AiProviderInterface::class, fn () => new FakeAiProvider(
            json_encode([
                'overall_score' => 78,
                'score_breakdown' => [
                    'technical' => 20,
                    'communication' => 18,
                    'confidence' => 12,
                    'problem_solving' => 16,
                    'best_practices' => 12,
                ],
                'summary' => 'Yaxşı ümumi performans.',
                'weak_points' => ['Error handling'],
                'strong_points' => ['Clean code'],
                'recommended_topics' => ['Exception Handling'],
            ])
        ));

        $user = $this->authenticatedUser();
        $interview = Interview::create([
            'user_id' => $user->id,
            'type' => 'backend',
            'difficulty' => 'medium',
            'status' => 'in_progress',
        ]);
        $question = Question::create([
            'interview_id' => $interview->id,
            'content' => 'Sual',
            'order' => 1,
        ]);
        Answer::create([
            'question_id' => $question->id,
            'content' => 'Cavab',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/interviews/{$interview->id}/complete");

        $response->assertStatus(200)
            ->assertJsonPath('interview.status', 'completed')
            ->assertJsonPath('report.summary', 'Yaxşı ümumi performans.');

        $this->assertDatabaseHas('interviews', [
            'id' => $interview->id,
            'status' => 'completed',
            'overall_score' => 78,
        ]);

        $this->assertDatabaseHas('reports', [
            'interview_id' => $interview->id,
            'summary' => 'Yaxşı ümumi performans.',
        ]);
    }

    public function test_active_endpoint_returns_in_progress_interview(): void
    {
        $user = $this->authenticatedUser();
        Interview::create([
            'user_id' => $user->id,
            'type' => 'frontend',
            'difficulty' => 'easy',
            'status' => 'completed',
        ]);
        $active = Interview::create([
            'user_id' => $user->id,
            'type' => 'backend',
            'difficulty' => 'medium',
            'status' => 'in_progress',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/interviews/active');

        $response->assertStatus(200)
            ->assertJsonPath('interview.id', $active->id);
    }

}
