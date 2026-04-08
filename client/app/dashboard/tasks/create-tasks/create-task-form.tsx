import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { FilePicker } from "./file-picker";
import { TaskTab } from "./task-tabs";
import React, { useEffect } from "react";
import FormInputs from "./fom-inputs";
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
import { errorToast } from "@/components/ui/toast";

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
    console.log("Data received during submission: ", data);
    console.log("Requesting for a signed_url: ", await getUploadSignature());

    const uploadToCloudinary = async (
      file: File,
      config: UploadUrlConfigType,
    ) => {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("api_key", config.apiKey);
      formData.append("timestamp", config.timestamp.toString());
      formData.append("signature", config.signature);
      formData.append("folder", config.folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      console.log(data);
      return {
        bytes: data.bytes,
        resourceType: data.resource_type,
        publicId: data.public_id,
        name: data.display_name,
        cloudinaryUrl: data.secure_url,
        fileExtension: data.display_name.split(".").pop(),
      };
    };

    if (data.attachments && data.attachments.length > 0) {
      if (!uploadConfig) {
        errorToast();
      }

      const uploads = data.attachments.map((file) =>
        uploadToCloudinary(file, uploadConfig),
      );

      console.log("uploads", uploads);

      const results: FileAttachements = await Promise.all(uploads);
      console.log("Submitted Task:", results);

      if (!results) {
        return;
      }
      console.log("results", results);
      data.attachments = results;

      // send another mutation to backend confirming data has been uploaded successfully
    }
    await createTask({
      variables: {
        input: data,
      },
    });
  };
  //

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
