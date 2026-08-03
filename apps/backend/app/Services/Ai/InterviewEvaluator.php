<?php

namespace App\Services\Ai;

use App\Models\Interview;
use App\Models\Report;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class InterviewEvaluator
{
    public function __construct(
        private readonly AiProviderInterface $aiProvider,
        private readonly EvaluationPromptBuilder $promptBuilder,
    ) {}

    public function evaluate(Interview $interview): Report
    {
        [$systemPrompt, $transcript] = $this->promptBuilder->build($interview);

        $rawResponse = $this->aiProvider->chat($systemPrompt, [
            ['role' => 'user', 'content' => $transcript],
        ]);

        $data = $this->parseJson($rawResponse);

        $interview->update([
            'overall_score' => $data['overall_score'] ?? null,
            'score_breakdown' => $data['score_breakdown'] ?? null,
        ]);

        return Report::updateOrCreate(
            ['interview_id' => $interview->id],
            [
                'summary' => $data['summary'] ?? 'Qiymətləndirmə tam alınmadı.',
                'weak_points' => $data['weak_points'] ?? [],
                'strong_points' => $data['strong_points'] ?? [],
                'recommended_topics' => $data['recommended_topics'] ?? [],
            ]
        );
    }

    /**
     * AI bəzən JSON-un ətrafına markdown code fence və ya izah mətni əlavə edir.
     * Bu, yalnız {...} hissəsini çıxarıb parse etməyə çalışır.
     */
    private function parseJson(string $raw): array
    {
        $cleaned = trim($raw);
        $cleaned = preg_replace('/^```json\s*|\s*```$/m', '', $cleaned);

        $start = strpos($cleaned, '{');
        $end = strrpos($cleaned, '}');

        if ($start === false || $end === false) {
            Log::warning('AI evaluation JSON tapılmadı', ['raw' => $raw]);
            return [];
        }

        $jsonString = substr($cleaned, $start, $end - $start + 1);
        $decoded = json_decode($jsonString, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('AI evaluation JSON parse xətası', ['raw' => $raw, 'error' => json_last_error_msg()]);
            return [];
        }

        return $decoded;
    }
}