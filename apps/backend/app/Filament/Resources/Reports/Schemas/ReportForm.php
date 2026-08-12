<?php

namespace App\Filament\Resources\Reports\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ReportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('interview_id')
                    ->relationship('interview', 'id')
                    ->required(),
                Textarea::make('summary')
                    ->columnSpanFull(),
                TextInput::make('weak_points'),
                TextInput::make('strong_points'),
                TextInput::make('recommended_topics'),
                TextInput::make('speaking_speed')
                    ->numeric(),
                TextInput::make('filler_word_count')
                    ->numeric(),
            ]);
    }
}
