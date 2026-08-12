<?php

namespace App\Filament\Resources\Interviews\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class InterviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('type')
                    ->required(),
                TextInput::make('difficulty')
                    ->required(),
                TextInput::make('status')
                    ->required()
                    ->default('in_progress'),
                TextInput::make('overall_score')
                    ->numeric(),
                TextInput::make('score_breakdown'),
                DateTimePicker::make('started_at'),
                DateTimePicker::make('completed_at'),
            ]);
    }
}
