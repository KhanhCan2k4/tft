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
        Schema::create('to_forums', function (Blueprint $table) {
            $table->string('mssv',9)->nullable();
            $table->unsignedBigInteger('forum_id');
            $table->text('note')->nullable();
            $table->timestamp("created_at")->useCurrent();
            $table->timestamp("updated_at")->useCurrentOnUpdate()->nullable();
            $table->foreign('mssv')->references("users")->on("mssv")->nullOnDelete();
            $table->foreign('forum_id')->references("forums")->on("id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('to_forums');
    }
};
