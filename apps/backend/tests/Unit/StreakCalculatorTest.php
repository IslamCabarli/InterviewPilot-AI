<?php

namespace Tests\Unit;

use App\Models\Interview;
use App\Models\User;
use App\Services\StreakCalculator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StreakCalculatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_zero_when_no_completed_interviews(): void
    {
        $user = User::factory()->create();
        $calculator = new StreakCalculator;

        $this->assertSame(0, $calculator->calculate($user->id));
    }

    public function test_counts_consecutive_days_ending_today(): void
    {
        $user = User::factory()->create();

        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'completed_at' => today(),
        ]);

        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'completed_at' => subDay(),
        ]);

        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'completed_at' => subDays(2),
        ]);

        $calculator = new StreakCalculator;

        $this->assertSame(3, $calculator->calculate($user->id));
    }

    public function test_streak_breaks_on_gap_day(): void
    {
        $user = User::factory()->create();

        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'completed_at' => today(),
        ]);
        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'completed_at' => today()->subDays(2),
        ]);

        $calculator = new StreakCalculator;

        $this->assertSame(1, $calculator->calculate($user->id));
    }

    public function test_streak_is_zero_if_last_activity_was_not_today(): void
    {
        $user = User::factory()->create();

        Interview::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'completed_at' => today()->subDays(2),
        ]);

        $calculator = new StreakCalculator;

        $this->assertSame(0, $calculator->calculate($user->id));
    }
}
