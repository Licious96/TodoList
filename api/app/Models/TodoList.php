<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TodoList extends Model
{
    use HasFactory;
    protected $fillable = [
        'task',
        'userId',
        'date',
        'time',
        'done',
        'identifier'
    ];
}
