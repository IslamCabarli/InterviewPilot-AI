<?php

namespace App\Services\Ai;

use App\Models\Interview;

class EvaluationPromptBuilder
{
    public function build(Interview $interview): array
    {
        $transcript = $interview->questions()
            ->with('answer')
            ->orderBy('order')
            ->get()
            ->map(function ($q) {
                $answer = $q->answer?->content ?? '(cavab verilməyib)';
                return "Q: {$q->content}\nA: {$answer}";
            })
            ->implode("\n\n");

        $systemPrompt = <<<PROMPT
You are an expert technical interview evaluator. You will receive a full interview transcript for a {$interview->type} position at {$interview->difficulty} difficulty level.

Evaluate the candidate and respond with ONLY a valid JSON object (no markdown, no explanation, no code fences) in exactly this format:

{
  "overall_score": <integer 0-100>,
  "score_breakdown": {
    "technical": <integer 0-25>,
    "communication": <integer 0-20>,
    "confidence": <integer 0-15>,
    "problem_solving": <integer 0-20>,
    "best_practices": <integer 0-20>
  },
  "summary": "<2-3 sentence overall summary>",
  "weak_points": ["<point 1>", "<point 2>", "<point 3>"],
  "strong_points": ["<point 1>", "<point 2>"],
  "recommended_topics": ["<topic 1>", "<topic 2>", "<topic 3>"]
}

Scores in score_breakdown must sum to overall_score. Be honest and specific — base everything strictly on the transcript content, not assumptions.
PROMPT;

        return [$systemPrompt, $transcript];
    }
}