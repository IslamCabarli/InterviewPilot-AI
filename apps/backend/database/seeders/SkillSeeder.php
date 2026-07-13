<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            ['name' => 'Laravel', 'category' => 'backend'],
            ['name' => 'PHP', 'category' => 'backend'],
            ['name' => 'React', 'category' => 'frontend'],
            ['name' => 'TypeScript', 'category' => 'frontend'],
            ['name' => 'SQL', 'category' => 'database'],
            ['name' => 'Docker', 'category' => 'devops'],
            ['name' => 'System Design', 'category' => 'architecture'],
            ['name' => 'Communication', 'category' => 'soft-skill'],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}