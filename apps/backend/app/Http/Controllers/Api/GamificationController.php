<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Services\StreakCalculator;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class GamificationController extends Controller
{

    public function __construct(
        private readonly StreakCalculator $streakCalculator,
    ) {}
    private const XP_PER_LEVEL = 200;

    #[OA\Get(
        path: '/gamification/stats',
        summary: 'XP, level və badge statusu',
        tags: ['Gamification'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Gamification statistikası'),
        ]
    )]
    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        $completed = Interview::where('user_id', $userId)
            ->where('status', 'completed')
            ->whereNotNull('overall_score')
            ->get();

        $totalXp = (int) $completed->sum('overall_score');
        $level = intdiv($totalXp, self::XP_PER_LEVEL) + 1;
        $xpIntoLevel = $totalXp % self::XP_PER_LEVEL;
        $xpForNextLevel = self::XP_PER_LEVEL;

        $streak = $this->streakCalculator->calculate($userId);
        $bestScore = (int) ($completed->max('overall_score') ?? 0);
        $completedCount = $completed->count();

        $badges = [
            [
                'key' => 'first_interview',
                'label' => 'İlk addım',
                'description' => 'İlk müsahibəni tamamla',
                'unlocked' => $completedCount >= 1,
            ],
            [
                'key' => 'five_interviews',
                'label' => 'Davamlılıq',
                'description' => '5 müsahibə tamamla',
                'unlocked' => $completedCount >= 5,
            ],
            [
                'key' => 'twenty_interviews',
                'label' => 'Sadiq namizəd',
                'description' => '20 müsahibə tamamla',
                'unlocked' => $completedCount >= 20,
            ],
            [
                'key' => 'high_score',
                'label' => 'Güclü nəticə',
                'description' => 'Bir müsahibədə 80+ bal al',
                'unlocked' => $bestScore >= 80,
            ],
            [
                'key' => 'streak_3',
                'label' => 'İsti başlanğıc',
                'description' => '3 gün ardıcıl təcrübə et',
                'unlocked' => $streak >= 3,
            ],
            [
                'key' => 'streak_7',
                'label' => 'Dəmir intizam',
                'description' => '7 gün ardıcıl təcrübə et',
                'unlocked' => $streak >= 7,
            ],
        ];

        return response()->json([
            'totalXp' => $totalXp,
            'level' => $level,
            'xpIntoLevel' => $xpIntoLevel,
            'xpForNextLevel' => $xpForNextLevel,
            'streak' => $streak,
            'badges' => $badges,
        ]);
    }


}
