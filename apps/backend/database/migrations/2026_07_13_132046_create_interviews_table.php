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
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');      // frontend, backend, hr
            $table->string('difficulty');       // easy, medium, hard, senior
            $table->string('status')->default('in_progres');  // in_progress, completed, cancelled
            $table->integer('overall_score')->nullable();
            $table->json('score_breakdown')->nullable();  // {technical: 25, communication: 20, problem_solving: 15}
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
