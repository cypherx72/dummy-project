"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldTitle,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { FaPaperclip } from "react-icons/fa";
import { UseFormReturn, Controller } from "react-hook-form";
import { CreateTaskValues } from "../schema";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const allowedTypes = [
  "application/pdf",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export function FilePicker({
  form,
}: {
  form: UseFormReturn<CreateTaskValues>;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string[]>([]);

  return (
    <Controller
      name="attachments"
      control={form.control}
      render={({ field, fieldState }) => {
        const files: File[] = field.value || [];

        const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          setError([]);

          const selectedFiles = e.target.files;

          if (!selectedFiles || selectedFiles.length === 0) {
            setError(["Please select at least one file."]);
            return;
          }

          const validFiles: File[] = [];

          for (const file of Array.from(selectedFiles)) {
            if (!allowedTypes.includes(file.type)) {
              setError((prev) => [...prev, `${file.name} is not supported.`]);
              continue;
            }

            if (file.size > MAX_FILE_SIZE) {
              setError((prev) => [...prev, `${file.name} exceeds 20MB.`]);
              continue;
            }

            validFiles.push(file);
          }

          if (validFiles.length === 0) return;

          field.onChange([...files, ...validFiles]);
        };

        const removeFile = (index: number) => {
          const updated = files.filter((_, i) => i !== index);
          field.onChange(updated);
        };

        return (
          <Field className="p-4 border rounded-2xl">
            <FieldTitle>Reference Material / Attachments</FieldTitle>

            <div className="flex flex-row items-center gap-2">
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                onChange={handleFileUpload}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="p-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPaperclip className="size-5" />
              </Button>

              <FieldLabel htmlFor="file" className="text-zinc-300">
                Select attachments
              </FieldLabel>
            </div>

            <FieldContent>
              {files.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-3 py-2 border border-zinc-700 rounded-lg"
                    >
                      <span className="text-zinc-300 text-sm">{file.name}</span>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </FieldContent>

            {/* validation errors */}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

            {/* custom upload errors */}
            {error.length > 0 && (
              <div className="mt-2 text-red-500 text-sm">
                {error.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            )}
          </Field>
        );
      }}
    />
  );
}
