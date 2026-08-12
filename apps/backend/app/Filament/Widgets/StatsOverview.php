<?php

namespace App\Filament\Widgets;

use App\Models\Interview;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Ümumi istifadəçi', User::count()),
            Stat::make('Ümumi müsahibə', Interview::count()),
            Stat::make('Tamamlanmış müsahibə', Interview::where('status', 'completed')->count()),
        ];
    }
}