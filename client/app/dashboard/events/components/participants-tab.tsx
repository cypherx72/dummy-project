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

type ParticipantsValue = {
  type: "everyone" | "criteria" | null;
  years: string[];
  departments: string[];
  courses: string[];
};

export function ParticipantsTab({ form }: { form: UseFormReturn }) {
  return (
    <TabsContent value="participants">
      <FieldGroup className="flex-col mx-auto p-2 border-1 rounded-md w-full">
        <Controller
          name="participants"
          control={form.control}
          render={({ field, fieldState }) => {
            const isInvalid = fieldState.invalid;
            const value: ParticipantsValue = field.value ?? {
              type: null,
              years: [],
              departments: [],
              courses: [],
            };

            const toggleItem = (
              key: "years" | "departments" | "courses",
              id: string,
            ) => {
              const current: string[] = value[key] ?? [];
              const updated = current.includes(id)
                ? current.filter((i) => i !== id)
                : [...current, id];
              field.onChange({ ...value, [key]: updated });
            };

            return (
              <FieldSet data-invalid={isInvalid}>
                <FieldLegend variant="label">Participants</FieldLegend>
                <FieldDescription>
                  Choose who can attend this event.
                </FieldDescription>

                <RadioGroup
                  name={field.name}
                  value={value.type ?? ""}
                  onValueChange={(v) =>
                    field.onChange({
                      ...value,
                      type: v as "everyone" | "criteria",
                      ...(v === "everyone" && {
                        years: [],
                        departments: [],
                        courses: [],
                      }),
                    })
                  }
                  aria-invalid={isInvalid}
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
                        // aria-invalid={isInvalid}
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
                        aria-invalid={isInvalid}
                      />
                    </Field>
                    {isInvalid && <FieldError errors={[fieldState.error]} />}
                  </FieldLabel>
                </RadioGroup>

                {/* Criteria sub-fields */}
                {value.type === "criteria" && (
                  <div className="flex flex-col gap-4 mt-2 pl-1">
                    {/* Year */}
                    <FieldSet>
                      <FieldLegend variant="label">Year</FieldLegend>
                      <FieldDescription>
                        Select one or more year groups.
                      </FieldDescription>
                      <div className="flex flex-row flex-wrap gap-2 mt-1">
                        {years.map((year) => {
                          const selected = value.years.includes(year.id);
                          return (
                            <button
                              key={year.id}
                              type="button"
                              onClick={() => toggleItem("years", year.id)}
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
                    </FieldSet>

                    {/* Department */}
                    <FieldSet>
                      <FieldLegend variant="label">Department</FieldLegend>
                      <FieldDescription>
                        Select one or more departments.
                      </FieldDescription>
                      <div className="flex flex-row flex-wrap gap-2 mt-1">
                        {departments.map((dept) => {
                          const selected = value.departments.includes(dept.id);
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              onClick={() => toggleItem("departments", dept.id)}
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
                    </FieldSet>

                    {/* Course */}
                    <FieldSet>
                      <FieldLegend variant="label">
                        Course / Subject
                      </FieldLegend>
                      <FieldDescription>
                        Select one or more courses.
                      </FieldDescription>
                      <div className="flex flex-row flex-wrap gap-2 mt-1">
                        {courses.map((course) => {
                          const selected = value.courses.includes(course.id);
                          return (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => toggleItem("courses", course.id)}
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
                    </FieldSet>

                    {/* Summary */}
                    {(value.years.length > 0 ||
                      value.departments.length > 0 ||
                      value.courses.length > 0) && (
                      <div className="mt-1 text-muted-foreground text-sm">
                        Sending to:{" "}
                        {[
                          value.years.length > 0 &&
                            `${value.years.length} year group${value.years.length > 1 ? "s" : ""}`,
                          value.departments.length > 0 &&
                            `${value.departments.length} department${value.departments.length > 1 ? "s" : ""}`,
                          value.courses.length > 0 &&
                            `${value.courses.length} course${value.courses.length > 1 ? "s" : ""}`,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {isInvalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            );
          }}
        />
      </FieldGroup>
    </TabsContent>
  );
}
