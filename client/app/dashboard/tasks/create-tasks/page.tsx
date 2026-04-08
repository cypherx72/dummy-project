"use client";

import { CreateTaskForm } from "./create-task-form";
import { useState } from "react";

export default function CreateTask() {
  return (
    <div className="flex flex-col mx-auto my-6 p-3 border-1 rounded-2xl w-full max-w-md font-sans">
      <span className="flex flex-col px-6 py-4">
        <p className="font-semibold tracking-wide">Create New Task</p>
        <p className="text-zinc-300 text-sm">Set your daily activity goal.</p>
      </span>
      <div className="p-2 h-[85lvh] overflow-y-auto no-scrollbar">
        <CreateTaskForm />
      </div>
    </div>
  );
}
