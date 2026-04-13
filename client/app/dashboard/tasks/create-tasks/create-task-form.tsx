import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { FilePicker } from "./file-picker";
import { TaskTab } from "./task-tabs";
import React, { useEffect } from "react";
import FormInputs from "./fom-inputs";
import { handleFileSubmit, uploadToCloudinary } from "../uploadToCloudinary";
import {
  CreateTaskSchema,
  CreateTaskValues,
  FileAttachements,
} from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExtendSwitch } from "./switch";
import { useTaskUI } from "@/context/tasks/task-context";
import { UploadUrlConfigType } from "../types-args";
import { errorToast, showToast } from "@/components/ui/toast";

export function CreateTaskForm() {
  const { getUploadSignature, uploadConfig, createTask } = useTaskUI();

  const courseId = "Data Structures";

  const form = useForm<CreateTaskValues>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      instructions: "",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "00:00:00",
      courseId,
      maxPoints: 20,
      extendDate: false,
      priorityStatus: "low",
      submissionType: "fileUpload",
      attachments: [],
      comments: "",
    },
  });

  const onSubmit = async (data: CreateTaskValues) => {
    const results = await handleFileSubmit({
      data,
      configData: uploadConfig,
      fetchConfig: getUploadSignature,
    });

    console.log("results", results);
    data.attachments = results;

    // send another mutation to backend confirming data has been uploaded successfully

    await createTask({
      variables: {
        input: data,
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex px-4 w-full max-w-sm h-full overflow-hidden overflow-y-auto no-scrollbar"
    >
      <FieldGroup>
        {/* Task meta inputs */}
        <FormInputs form={form} />

        {/* Title / description / comments */}
        <TaskTab form={form} />

        {/* Attachments */}
        <FilePicker form={form} />

        {/*Extend Switch */}
        <ExtendSwitch form={form} />

        {/* Actions */}
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Create Task
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
