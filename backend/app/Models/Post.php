<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function tags() : BelongsToMany {
        return $this->belongsToMany(Tag::class);
    }

    public function comments() : HasMany {
        return $this->hasMany(Comment::class);
    }

    public function forum() : BelongsTo {
        return $this->belongsTo(Forum::class);
    }

    protected $fillable = ['title', 'content', 'author', 'tags', 'forum', 'comments'];

}
