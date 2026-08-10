<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Cv\CvParser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class CvController extends Controller
{
    public function __construct(
        private readonly CvParser $parser,
    ) {}

    #[OA\Post(
        path: '/cv/upload',
        summary: 'CV yüklə (PDF)',
        tags: ['CV'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Cv is uploaded and get text'),
        ]
    )]
    public function upload(Request $request)
    {
        $request->validate([
            'cv' => ['required', 'file', 'mimes:pdf', 'max:5120'], // max 5MB
        ]);

        $user = $request->user();

        if ($user->cv_path) {
            Storage::disk('local')->delete($user->cv_path);
        }

        $file = $request->file('cv');
        $path = $file->store('cvs/' . $request->user()->id, 'local');
        $text = $this->parser->extractText($file);

        $request->user()->update([
            'cv_path' => $path,
            'cv_text' => $text,
            'cv_uploaded_at' => now(),
        ]);

        return response()->json([
            'message' => 'CV uğurla yükləndi.',
            'preview' => mb_substr($text, 0, 300) . (mb_strlen($text) > 300 ? '...' : ''),
        ]);
    }

    #[OA\Get(
        path: '/cv/status',
        summary: 'CV yüklənib-yüklənmədiyini yoxla',
        tags: ['CV'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'CV statusu'),
        ]
    )]
    public function status(Request $request)
    {
        $user = $request->user();



        return response()->json([
            'hasCv' => ! is_null($user->cv_path),
            'uploadedAt' => $user->cv_uploaded_at,
        ]);
    }

    #[OA\Delete(
        path: '/cv',
        summary: 'CV-ni sil',
        tags: ['CV'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'CV silindi'),
        ]
    )]
    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user->cv_path) {
            Storage::disk('local')->delete($user->cv_path);
        }

        $user->update(['cv_path' => null, 'cv_text' => null, 'cv_uploaded_at' => null]);

        return response()->json(['message' => 'CV silindi.']);
    }
}
