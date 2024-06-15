<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }

    protected function threat() : BelongsTo {
        return $this->belongsTo(Threat::class);
    }
}
