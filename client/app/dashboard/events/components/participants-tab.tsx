"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldTitle,
  FieldLegend,
  FieldSet,
  FieldGroup,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EventFormValues } from "../schema/schema";

const years = [
  { id: "first", label: "1st Year" },
  { id: "second", label: "2nd Year" },
  { id: "third", label: "3rd Year" },
  { id: "fourth", label: "4th Year" },
] as const;

const departments = [
  { id: "cs", label: "Computer Science" },
  { id: "eng", label: "Engineering" },
  { id: "bus", label: "Business" },
  { id: "arts", label: "Arts & Humanities" },
  { id: "sci", label: "Natural Sciences" },
] as const;

const courses = [
  { id: "math101", label: "Mathematics 101" },
  { id: "cs201", label: "Introduction to Programming" },
  { id: "eng301", label: "Technical Writing" },
  { id: "bus401", label: "Business Strategy" },
] as const;

export function ParticipantsTab({
  form,
}: {
  form: UseFormReturn<EventFormValues>;
}) {
  return (
    <TabsContent value="participants">
      <FieldGroup className="flex-col mx-auto p-2 border-1 rounded-md w-full">
        <FieldSet>
          <FieldLegend variant="label">Participants</FieldLegend>
          <FieldDescription>Choose who can attend this event.</FieldDescription>

          {/* Participant type radio */}
          <Controller
            name="participants.type"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <RadioGroup
                  name={field.name}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  {/* Option 1 — Everyone */}
                  <FieldLabel htmlFor="participants-everyone">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Everyone</FieldTitle>
                        <FieldDescription>
                          Open invite — all students can attend.
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value="everyone"
                        id="participants-everyone"
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>

                  {/* Option 2 — By Criteria */}
                  <FieldLabel htmlFor="participants-criteria">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>By Criteria</FieldTitle>
                        <FieldDescription>
                          Target specific years, departments, or courses.
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value="criteria"
                        id="participants-criteria"
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>
                </RadioGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </>
            )}
          />

          {/* Criteria sub-fields — only shown when type === "criteria" */}
          {form.watch("participants.type") === "criteria" && (
            <div className="flex flex-col gap-4 mt-2 pl-1">
              {/* Years */}
              <Controller
                name="participants.years"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Year</FieldLegend>
                    <FieldDescription>
                      Select one or more year groups.
                    </FieldDescription>
                    <div className="flex flex-row flex-wrap gap-2 mt-1">
                      {years.map((year) => {
                        const selected = (field.value ?? []).includes(year.id);
                        return (
                          <button
                            key={year.id}
                            type="button"
                            onClick={() => {
                              const current: string[] = field.value ?? [];
                              field.onChange(
                                selected
                                  ? current.filter((i) => i !== year.id)
                                  : [...current, year.id],
                              );
                            }}
                            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                              selected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-muted-foreground/30 hover:border-primary"
                            }`}
                          >
                            {year.label}
                          </button>
                        );
                      })}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />

              {/* Departments */}
              <Controller
                name="participants.departments"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Department</FieldLegend>
                    <FieldDescription>
                      Select one or more departments.
                    </FieldDescription>
                    <div className="flex flex-row flex-wrap gap-2 mt-1">
                      {departments.map((dept) => {
                        const selected = (field.value ?? []).includes(dept.id);
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => {
                              const current: string[] = field.value ?? [];
                              field.onChange(
                                selected
                                  ? current.filter((i) => i !== dept.id)
                                  : [...current, dept.id],
                              );
                            }}
                            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                              selected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-muted-foreground/30 hover:border-primary"
                            }`}
                          >
                            {dept.label}
                          </button>
                        );
                      })}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />

              {/* Courses */}
              <Controller
                name="participants.courses"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Course / Subject</FieldLegend>
                    <FieldDescription>
                      Select one or more courses.
                    </FieldDescription>
                    <div className="flex flex-row flex-wrap gap-2 mt-1">
                      {courses.map((course) => {
                        const selected = (field.value ?? []).includes(
                          course.id,
                        );
                        return (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => {
                              const current: string[] = field.value ?? [];
                              field.onChange(
                                selected
                                  ? current.filter((i) => i !== course.id)
                                  : [...current, course.id],
                              );
                            }}
                            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                              selected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-muted-foreground/30 hover:border-primary"
                            }`}
                          >
                            {course.label}
                          </button>
                        );
                      })}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />

              {/* Summary */}
              {(() => {
                const y = form.watch("participants.years") ?? [];
                const d = form.watch("participants.departments") ?? [];
                const c = form.watch("participants.courses") ?? [];
                return y.length > 0 || d.length > 0 || c.length > 0 ? (
                  <div className="mt-1 text-muted-foreground text-sm">
                    Sending to:{" "}
                    {[
                      y.length > 0 &&
                        `${y.length} year group${y.length > 1 ? "s" : ""}`,
                      d.length > 0 &&
                        `${d.length} department${d.length > 1 ? "s" : ""}`,
                      c.length > 0 &&
                        `${c.length} course${c.length > 1 ? "s" : ""}`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </FieldSet>
      </FieldGroup>
    </TabsContent>
  );
}
