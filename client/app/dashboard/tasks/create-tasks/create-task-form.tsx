"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { FilePicker } from "./file-picker";
import { TaskTab } from "./task-tabs";
import React, { useEffect } from "react";
import FormInputs from "./form-inputs";
import { handleFileSubmit } from "../uploadToCloudinary";
import { CreateTaskSchema, CreateTaskValues } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExtendSwitch } from "./switch";
import { useTaskUI } from "@/context/tasks/task-context";
import { errorToast, showToast } from "@/components/ui/toast";
import { useEnrollment } from "@/app/hooks/tasks/useEnrollment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function CreateTaskForm() {
  const { getUploadSignature, uploadConfig, createTask } = useTaskUI();
  const { fetchTeacherCourses, teacherCourses, teacherCoursesLoading } =
    useEnrollment();

  // Load the teacher's courses on mount so the dropdown is populated
  useEffect(() => {
    fetchTeacherCourses();
  }, [fetchTeacherCourses]);

  const form = useForm<CreateTaskValues>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      instructions: "",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "00:00:00",
      courseId: "",
      maxPoints: 20,
      extendDate: false,
      priorityStatus: "low",
      submissionType: "fileUpload",
      attachments: [],
      comments: "",
    },
  });

  // Pre-select the first available course once courses load
  useEffect(() => {
    const currentCourseId = form.getValues("courseId");
    if (!currentCourseId && teacherCourses.length > 0) {
      form.setValue("courseId", teacherCourses[0].id);
    }
  }, [teacherCourses, form]);

  const onSubmit = async (data: CreateTaskValues) => {
    try {
      const results = await handleFileSubmit({
        data,
        configData: uploadConfig,
        fetchConfig: getUploadSignature,
      });

      data.attachments = results as any;

      const response = await createTask({ variables: { input: data } });

      if (response?.data?.CreateTask?.status === 200) {
        showToast(
          "Assignment created!",
          "The assignment has been posted to students.",
          "success",
        );
        form.reset();
      } else {
        errorToast(
          response?.data?.CreateTask?.message ?? "Failed to create assignment.",
        );
      }
    } catch (err: any) {
      errorToast(err?.message ?? "An unexpected error occurred.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex px-4 w-full max-w-sm h-full overflow-hidden overflow-y-auto no-scrollbar"
    >
      <FieldGroup>
        {/* Course selector — replaces the old hardcoded courseId */}
        <Field>
          <Label htmlFor="courseId">Course</Label>
          <Select
            value={form.watch("courseId")}
            onValueChange={(val) => form.setValue("courseId", val)}
            disabled={teacherCoursesLoading}
          >
            <SelectTrigger id="courseId">
              <SelectValue
                placeholder={
                  teacherCoursesLoading ? "Loading courses…" : "Select a course"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {teacherCourses.map((course: { id: string; name: string; code: string }) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.courseId && (
            <p className="text-destructive text-sm mt-1">
              {form.formState.errors.courseId.message}
            </p>
          )}
        </Field>

        {/* Task meta inputs */}
        <FormInputs form={form} />

        {/* Title / description / comments */}
        <TaskTab form={form} />

        {/* Attachments */}
        <FilePicker form={form} />

        {/* Extend Switch */}
        <ExtendSwitch form={form} />

        {/* Actions */}
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating…" : "Create Task"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
