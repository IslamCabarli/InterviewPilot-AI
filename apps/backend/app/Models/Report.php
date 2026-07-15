<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'interview_id',
        'summary',
        'weak_points',
        'strong_points',
        'recommended_topics',
        'speaking_speed',
        'filler_word_count',
    ];

    protected $casts = [
        'weak_points' => 'array',
        'strong_points' => 'array',
        'recommended_topics' => 'array',
    ];

    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }
}