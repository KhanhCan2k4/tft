<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('threats', function (Blueprint $table) {
            $table->id();
            $table->text("content");
            $table->unsignedBigInteger("likes")->default(0);
            $table->unsignedBigInteger("views")->default(0);
            $table->timestamp("created_at")->useCurrent();
            $table->timestamp("updated_at")->useCurrentOnUpdate()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('threats');
    }
};
