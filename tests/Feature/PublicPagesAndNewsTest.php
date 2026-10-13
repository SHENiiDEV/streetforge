<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPagesAndNewsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_legal_pages_are_accessible(): void
    {
        $this->get('/about')->assertStatus(200);
        $this->get('/how-it-works')->assertStatus(200);
        $this->get('/faq')->assertStatus(200);
        $this->get('/terms')->assertStatus(200);
        $this->get('/privacy')->assertStatus(200);
        $this->get('/refund-policy')->assertStatus(200);
        $this->get('/aml-sanctions')->assertStatus(200);
        $this->get('/cookie-policy')->assertStatus(200);
    }

    public function test_extended_legal_pages_are_accessible(): void
    {
        $pages = [
            '/legal' => 'Legal/LegalCentre',
            '/payment-security' => 'Legal/PaymentSecurity',
            '/billing-terms' => 'Legal/BillingTerms',
            '/chargeback-policy' => 'Legal/ChargebackPolicy',
            '/virtual-credits' => 'Legal/VirtualCredits',
            '/fair-play' => 'Legal/FairPlay',
            '/responsible-play' => 'Legal/ResponsiblePlay',
            '/complaints' => 'Legal/Complaints',
            '/security' => 'Legal/Security',
            '/accessibility' => 'Legal/Accessibility',
            '/intellectual-property' => 'Legal/IntellectualProperty',
            '/contact' => 'Legal/Contact',
        ];

        foreach ($pages as $url => $component) {
            $this->get($url)
                ->assertStatus(200)
                ->assertInertia(fn ($page) => $page->component($component));
        }
    }

    public function test_news_index_and_articles_are_accessible(): void
    {
        $response = $this->get('/news');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('News/Index')->has('articles', 6));

        $showResponse = $this->get('/news/season-26-championship-kickoff');
        $showResponse->assertStatus(200);
        $showResponse->assertInertia(fn ($page) => $page->component('News/Show')->has('article'));
    }

    public function test_seasonal_leaderboard_is_accessible_and_contains_500_plus_racers(): void
    {
        $response = $this->get('/leaderboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Leaderboard/Index')
            ->has('seasons', 4)
            ->has('racers', 520)
            ->has('podium', 3)
            ->where('selectedSeasonId', 'season-4')
        );

        $season3Response = $this->get('/leaderboard?season=season-3');
        $season3Response->assertStatus(200);
        $season3Response->assertInertia(fn ($page) => $page
            ->component('Leaderboard/Index')
            ->where('selectedSeasonId', 'season-3')
            ->has('racers', 520)
        );
    }
}
