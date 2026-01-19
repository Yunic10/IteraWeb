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
    Schema::create('coupons', function (Blueprint $table) {
        $table->id();
        $table->string('code')->unique(); // Contoh: DISKON10
        $table->enum('type', ['fixed', 'percentage']); // Potongan harga tetap atau persen
        $table->integer('value'); // Jumlah potongan (misal: 10000 atau 10 untuk 10%)
        $table->integer('min_order')->default(0); // Minimal belanja untuk pakai kupon
        $table->date('expiry_date')->nullable(); // Tanggal kadaluarsa
        $table->integer('usage_limit')->nullable(); // Batas maksimal penggunaan
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
