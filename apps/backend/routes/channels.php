<?php

use App\Models\Interview;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('interview.{interviewId}', function ($user, $interviewId) {
    $interview = Interview::find($interviewId);
    return $interview && $interview->user_id === $user->id;
});