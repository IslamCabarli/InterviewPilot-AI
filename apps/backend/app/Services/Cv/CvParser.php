<?php

namespace App\Services\Cv;

use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Exception\EmptyPdfException;
use Smalot\PdfParser\Parser;

class CvParser
{
    public function extractText(UploadedFile $file): string
    {
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($file->getRealPath());
            $text = $pdf->getText();

            // Remove extra whitespace and newlines
            $text = preg_replace('/\s+/', ' ', $text ?? '');

            return mb_substr(trim($text), 0, 6000);
        } catch (EmptyPdfException | \Throwable) {
            return '';
        }
    }
}