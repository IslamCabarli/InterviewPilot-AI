<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'type', 'difficulty', 'status',
        'overall_score', 'score_breakdown', 'started_at', 'completed_at',
    ];

    protected $casts = [
        'score_breakdown' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function report(): HasOne
    {
        return $this->hasOne(Report::class);
    }
}
