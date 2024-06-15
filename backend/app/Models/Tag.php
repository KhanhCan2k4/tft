<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    public function posts() : BelongsToMany {
        return $this->belongsToMany(Post::class);
    }

    protected function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }
}
