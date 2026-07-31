<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AiResponseChunk implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $interviewId,
        public string $chunk,
        public bool $done = false,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("interview.{$this->interviewId}")];
    }

    public function broadcastAs(): string
    {
        return 'AiResponseChunk';
    }
}