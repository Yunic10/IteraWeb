<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('theme_categories', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // Contoh: Wedding, Birthday, Aqiqah
        $table->string('slug')->unique(); // Untuk URL yang rapi (wedding-invitation)
        $table->text('description')->nullable();
        $table->string('icon_url')->nullable(); // Ikon kecil untuk menu
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_categories');
    }
};
