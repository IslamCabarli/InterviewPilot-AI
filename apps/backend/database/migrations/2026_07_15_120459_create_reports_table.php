<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interview_id')->constrained()->cascadeOnDelete();
            $table->text('summary')->nullable();
            $table->json('weak_points')->nullable();
            $table->json('strong_points')->nullable();
            $table->json('recommended_topics')->nullable();
            $table->integer('speaking_speed')->nullable();
            $table->integer('filler_word_count')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
