<?php

namespace Tests\Feature;

use App\Models\User;
use Couchbase\Role;
use Database\Seeders\RoleSeeder;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_user_can_register_and_receives_user_role(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'islam',
            'email' => 'test@gmail.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user' =>['id', 'name', 'email'], 'token']);

        $user = User::where('email', 'test@gmail.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('user'));
    }
}
