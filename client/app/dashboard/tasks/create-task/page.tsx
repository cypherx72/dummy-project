"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CreateTaskForm } from "./create-task-form";
import { useState } from "react";

export default function CreateTask() {
  const [drawerState, setDrawerState] = useState<boolean>(false);
  return (
    <Drawer direction="right" open={drawerState} onOpenChange={setDrawerState}>
      <DrawerTrigger asChild>
        <Button variant="outline">Create Task</Button>
      </DrawerTrigger>
      <DrawerContent className="font-sans">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="font-semibold tracking-wide">
              Create New Task
            </DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-2 pb-0 h-[85lvh] overflow-y-auto no-scrollbar">
            <CreateTaskForm setDrawerState={setDrawerState} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
