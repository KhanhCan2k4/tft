<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ToForum extends Model
{
    use HasFactory;

    public function forum() : BelongsTo {
        return $this->belongsTo(Forum::class);
    }
}
