<?php

namespace App\Http\Controllers;

use App\Models\TodoList;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function addTask(Request $request) {
        
        $field = Validator::make(
            $request->all(),
            [
                'userId' => 'required',
                'task' => 'required'
            ]
        );

        if($field->fails()){
            return response()->json($field->errors(), 400);
        }

        $newTask = TodoList::create([
            'userId' => $request->userId,
            'task' => $request->task,
            'date' => $request->date,
            'time' => $request->time
        ]);

        return response()->json($newTask, 201);
    }

    public function getTasks($userId){
        $tasks = TodoList::where('userId', $userId)->get();
        return response()->json($tasks, 200);
    }

    public function done($id){
        $item = TodoList::find($id);

        if ($item->done) {
            $item->done = 0;
        }else{
            $item->done = 1;
        }

        $item->save();

        return response()->json(201);
        
    }

    public function destroy($id){

        $flight = TodoList::find($id);

        $flight->delete();

        return response()->json(200);
    }
}
