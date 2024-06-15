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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('role_id')->default(2);
            $table->string('password');
            $table->string('mssv',11)->unique(); //22211TT2577
            $table->string('avatar');
            $table->string('class');
            $table->float('grade')->default(0.0);
            $table->string('achievements');
            $table->rememberToken();
            $table->timestamp("created_at")->useCurrent();
            $table->timestamp("updated_at")->useCurrentOnUpdate()->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
