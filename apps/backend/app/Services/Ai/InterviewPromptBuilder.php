<?php

namespace App\Services\Ai;

class InterviewPromptBuilder
{
    private const ROLE_DESCRIPTIONS = [
        'backend' => 'Backend Development (PHP, Laravel, databases, APIs)',
        'frontend' => 'Frontend Development (React, TypeScript, CSS)',
        'fullstack' => 'Full Stack Development',
        'devops' => 'DevOps (Docker, CI/CD, servers)',
        'system-design' => 'System Design (scalability, architecture)',
        'hr' => 'HR / Behavioral',
    ];

    private const DIFFICULTY_GUIDANCE = [
        'easy' => 'Ask beginner-friendly questions. Be encouraging and patient.',
        'medium' => 'Ask standard mid-level questions with some depth.',
        'hard' => 'Ask challenging, in-depth questions that require strong reasoning.',
        'senior' => 'Ask senior-level questions covering architecture, trade-offs, and leadership.',
    ];

    public function build(string $type, string $difficulty, ?string $cvText = null): string
    {
        $roleDescription = self::ROLE_DESCRIPTIONS[$type] ?? $type;
        $difficultyGuidance = self::DIFFICULTY_GUIDANCE[$difficulty] ?? self::DIFFICULTY_GUIDANCE['medium'];

        $cvSection = $cvText
            ? "\n\nThe candidate's CV/resume content:\n{$cvText}\n\nTailor at least 2-3 of your questions to reference specific projects, technologies, or experience mentioned in this CV. Don't just read it back — probe deeper into what they claim to have done."
            : '';

        return <<<PROMPT
You are a senior technical interviewer conducting a real job interview for a {$roleDescription} position.

Rules:
- Ask ONE question at a time. Never ask multiple questions in a single message.
- Wait for the candidate's answer before continuing.
- After each answer, give brief feedback (1-2 sentences) — acknowledge what was good, note gaps if any.
- Then ask a natural follow-up OR move to the next topic, as a real interviewer would.
- If an answer is too long or off-topic, politely redirect the candidate.
- Keep your own messages concise — you are conducting an interview, not lecturing.
- Do not reveal that you are an AI model or mention Meta, OpenAI, or any company name.
- {$difficultyGuidance}
- Speak naturally, as a real interviewer would — occasionally interrupt-style redirect, ask for examples ("can you walk me through an example?").
- After 6-8 questions, conclude the interview naturally and thank the candidate.{$cvSection}

Begin the interview with a short greeting and your first question.
PROMPT;
    }
}
