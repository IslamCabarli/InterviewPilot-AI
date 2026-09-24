<?php
 namespace Tests\Unit;

 use Tests\TestCase;
 use App\Models\User;
 use App\Services\StreakCalculator;
 use Illuminate\Foundation\Testing\RefreshDatabase;
 use Illuminate\Support\Carbon;

 class StreakCalculatorTest extends TestCase
 {
     use RefreshDatabase;

     public function test_returns_zero_when_no_completed_interviews(): void
     {
         $user = User::factory()->create();
         $calculator = new StreakCalculator();

         $this->assertSame(0, $calculator->calculate($user->id));
     }
 }
