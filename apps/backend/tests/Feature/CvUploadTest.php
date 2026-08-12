<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CvUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upload_cv_pdf(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/cv/upload', [
                'cv' => UploadedFile::fake()->create('resume.pdf', 120, 'application/pdf'),
            ]);

        $response->assertOk();
        $this->assertNotNull($user->fresh()->cv_path);
        $this->assertNotNull($user->fresh()->cv_text);
        $this->assertNotNull($user->fresh()->cv_uploaded_at);
    }
}
