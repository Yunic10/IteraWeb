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
    Schema::create('print_products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('sku')->nullable();
    $table->string('unit')->default('Pcs'); // Pcs, Set, Meter
    $table->decimal('price', 12, 2);
    $table->decimal('original_price', 12, 2)->nullable();
    $table->string('image_url')->nullable();
    $table->timestamps();
});
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('print_products');
    }
};
