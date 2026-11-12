<?php

namespace Tests\Feature;

use App\Models\Interview;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_dashboard_stats(): void
    {
        $this->getJson('/api/dashboard/stats')->assertStatus(401);
    }

    public function test_new_user_gets_empty_stats(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/dashboard/stats')
            ->assertOk()
            ->assertJson([
                'todayPractice' => 0,
                'averageScore' => 0,
                'completedInterviews' => 0,
                'weeklyStreak' => 0,
                'skillRadar' => [],
            ])
            ->assertJsonCount(7, 'weeklyProgress');
    }

    public function test_stats_reflect_completed_interviews_and_radar_includes_max(): void
    {
        $user = User::factory()->create();

        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'overall_score' => 80,
            'score_breakdown' => ['technical' => 20, 'confidence' => 12],
            'completed_at' => now(),
        ]);
        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'overall_score' => 60,
            'score_breakdown' => ['technical' => 10, 'confidence' => 12],
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/dashboard/stats');

        $response->assertOk()
            ->assertJsonPath('completedInterviews', 2)
            ->assertJsonPath('averageScore', 70)
            ->assertJsonPath('weeklyStreak', 1);

        $radar = collect($response->json('skillRadar'))->keyBy('skill');

        $this->assertSame(15, $radar['Texniki']['value']);
        $this->assertSame(25, $radar['Texniki']['max']);
        $this->assertSame(12, $radar['Özünəinam']['value']);
        $this->assertSame(15, $radar['Özünəinam']['max']);
    }

    public function test_stats_never_include_other_users_interviews(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Interview::factory()->create([
            'user_id' => $other->id,
            'status' => 'completed',
            'overall_score' => 90,
            'completed_at' => now(),
        ]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/dashboard/stats')
            ->assertOk()
            ->assertJsonPath('completedInterviews', 0);
    }

    public function test_recent_interviews_returns_latest_five_completed_for_the_user_only(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        foreach (range(1, 6) as $day) {
            Interview::factory()->create([
                'user_id' => $user->id,
                'status' => 'completed',
                'overall_score' => 50 + $day,
                'completed_at' => now()->subDays(10 - $day),
            ]);
        }

        Interview::factory()->create(['user_id' => $user->id, 'status' => 'in_progress']);
        Interview::factory()->create([
            'user_id' => $other->id,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/dashboard/recent-interviews');

        $response->assertOk()->assertJsonCount(5, 'interviews');

        $scores = collect($response->json('interviews'))->pluck('overall_score')->all();
        $this->assertSame([56, 55, 54, 53, 52], $scores);
    }

    public function test_guest_cannot_view_recent_interviews(): void
    {
        $this->getJson('/api/dashboard/recent-interviews')->assertStatus(401);
    }
}
