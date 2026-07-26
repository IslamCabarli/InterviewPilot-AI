<?php

namespace App\Services\Ai;

use App\Models\Interview;

class ConversationBuilder
{
    /**
     * Interview-un indiyədək olan sual-cavablarını AI-a göndəriləcək
     * messages formatına çevirir (conversation memory).
     *
     * @return array<int, array{role: string, content: string}>
     */
    public function build(Interview $interview): array
    {
        $messages = [];

        $questions = $interview->questions()
            ->with('answer')
            ->orderBy('order')
            ->get();

        foreach ($questions as $question) {
            $messages[] = ['role' => 'assistant', 'content' => $question->content];

            if ($question->answer) {
                $messages[] = ['role' => 'user', 'content' => $question->answer->content];
            }
        }

        return $messages;
    }
}
