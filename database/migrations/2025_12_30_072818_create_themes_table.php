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
    Schema::create('themes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('theme_category_id')->constrained()->onDelete('cascade');
        $table->string('name'); // Nama Tema (misal: "Royal Gold")
        $table->string('preview_url'); // Link untuk demo/preview tema
        $table->string('thumbnail_url'); // Gambar pratinjau
        $table->integer('price')->default(0); // Harga tema jika berbayar
        $table->boolean('is_premium')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
