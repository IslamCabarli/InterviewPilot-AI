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
        $pdf = <<<'PDF'
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 55 >>
stream
BT
/F1 12 Tf
72 720 Td
(Hello CV) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000062 00000 n 
0000000124 00000 n 
0000000245 00000 n 
0000000699 00000 n 
trailer
<< /Root 1 0 R /Size 6 >>
startxref
780
%%EOF
PDF;

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/cv/upload', [
                'cv' => UploadedFile::fake()->createWithContent('resume.pdf', $pdf),
            ]);

        $response->assertOk();
        $this->assertNotNull($user->fresh()->cv_path);
        $this->assertNotNull($user->fresh()->cv_uploaded_at);
        $this->assertIsString($user->fresh()->cv_text);
    }
}
