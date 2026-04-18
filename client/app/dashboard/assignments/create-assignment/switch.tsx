"use client";

import { Field } from "@/components/ui/field";
import { UseFormReturn } from "react-hook-form";
import { CreateTaskValues } from "../schema";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const ExtendSwitch = ({
  form,
}: {
  form: UseFormReturn<CreateTaskValues>;
}) => {
  return (
    <Controller
      name="extendDate"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className="flex flex-row justify-center items-center">
          <Label htmlFor="extend-date">Extend Date</Label>
          <Switch
            disabled
            checked={field.value}
            onCheckedChange={field.onChange}
            id="extend-date"
          />
        </Field>
      )}
    />
  );
};
