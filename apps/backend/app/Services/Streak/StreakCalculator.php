<?php

namespace App\Services;

use App\Models\Interview;

class StreakCalculator
{
    public function calculate(int $userId): int
    {
        $dates = Interview::where('user_id', $userId)
            ->where('status', 'completed')
            ->selectRaw('DISTINCT DATE(completed_at) as day')
            ->orderByDesc('day')
            ->pluck('day')
            ->map(fn ($d) => (string) $d);

        if ($dates->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $cursor = today();

        foreach ($dates as $day) {
            if ($day === $cursor->toDateString()) {
                $streak++;
                $cursor = $cursor->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }
}
