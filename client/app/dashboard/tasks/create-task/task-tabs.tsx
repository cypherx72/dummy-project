import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, UseFormReturn } from "react-hook-form";
import { CreateTaskValues } from "../schema";
import { Field, FieldError } from "@/components/ui/field";

export function TaskTab({ form }: { form: UseFormReturn<CreateTaskValues> }) {
  return (
    <Tabs className="px-4 pt-2 pb-4 border-1 rounded-2xl" defaultValue="title">
      <TabsList variant="line">
        <TabsTrigger value="title">Title</TabsTrigger>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>

      {/* Title */}
      <TabsContent value="title">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col gap-1">
              <Input {...field} type="text" placeholder="Enter title" />

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </TabsContent>

      {/* Description */}
      <TabsContent value="description">
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col gap-1">
              <Textarea
                {...field}
                placeholder="Enter description"
                className="flex-1 p-2 pt-1 focus-visible:ring-0 h-16 text-sm align-bottom leading-5.5 tracking-wider no-scrollbar"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </TabsContent>

      {/* Comments */}
      <TabsContent value="comments">
        <Controller
          name="comments"
          control={form.control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Enter comments"
              className="flex-1 p-2 pt-1 focus-visible:ring-0 h-16 text-sm align-bottom leading-5.5 tracking-wider no-scrollbar"
            />
          )}
        />
      </TabsContent>
    </Tabs>
  );
}
