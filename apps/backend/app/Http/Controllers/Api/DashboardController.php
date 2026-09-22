<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;
use App\Services\StreakCalculator;

class DashboardController extends Controller
{
    public function __construct(
        private readonly StreakCalculator $streakCalculator,
    ) {}
    #[OA\Get(
        path: '/dashboard/stats',
        summary: 'Dashboard statistikası',
        tags: ['Dashboard'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Statistika məlumatları'),
        ]
    )]
    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        $todayPractice = Interview::where('user_id', $userId)
            ->whereDate('created_at', today())
            ->count();

        $averageScore = (int) round(
            Interview::where('user_id', $userId)
                ->where('status', 'completed')
                ->whereNotNull('overall_score')
                ->avg('overall_score') ?? 0
        );
        $weeklyStreak = $this->streakCalculator->calculate($userId);

        $completedInterviews = Interview::where('user_id', $userId)
            ->where('status', 'completed')
            ->count();

        $weeklyProgress = $this->weeklyProgress($userId);

        $skillRadar = $this->skillRadar($userId);

        return response()->json([
            'todayPractice' => $todayPractice,
            'averageScore' => $averageScore,
            'completedInterviews' => $completedInterviews,
            'weeklyStreak' => $weeklyStreak,
            'weeklyProgress' => $weeklyProgress,
            'skillRadar' => $skillRadar,
        ]);
    }

    /**
     * Son 7 günün hər biri üçün ortalama bal (məlumat yoxdursa null).
     */
    private function weeklyProgress(int $userId): array
    {
        $rows = Interview::where('user_id', $userId)
            ->where('status', 'completed')
            ->whereNotNull('overall_score')
            ->whereDate('completed_at', '>=', today()->subDays(6))
            ->selectRaw('DATE(completed_at) as day, AVG(overall_score) as avg_score')
            ->groupBy('day')
            ->pluck('avg_score', 'day');

        $result = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $key = $date->toDateString();
            $result[] = [
                'date' => $date->format('D'),
                'score' => isset($rows[$key]) ? (int) round($rows[$key]) : null,
            ];
        }

        return $result;
    }

    /**
     * score_breakdown-un kateqoriyaları üzrə ortalama — skill radar üçün.
     */
    private function skillRadar(int $userId): array
    {
        $breakdowns = Interview::where('user_id', $userId)
            ->where('status', 'completed')
            ->whereNotNull('score_breakdown')
            ->pluck('score_breakdown');

        if ($breakdowns->isEmpty()) {
            return [];
        }

        $sums = [];
        $counts = [];

        foreach ($breakdowns as $breakdown) {
            foreach ($breakdown as $key => $value) {
                $sums[$key] = ($sums[$key] ?? 0) + $value;
                $counts[$key] = ($counts[$key] ?? 0) + 1;
            }
        }

        $labels = [
            'technical' => 'Texniki',
            'communication' => 'Kommunikasiya',
            'confidence' => 'Özünəinam',
            'problem_solving' => 'Problem həlli',
            'best_practices' => 'Best Practices',
        ];

        $result = [];
        foreach ($sums as $key => $sum) {
            $result[] = [
                'skill' => $labels[$key] ?? $key,
                'value' => (int) round($sum / $counts[$key]),
            ];
        }

        return $result;
    }
}
