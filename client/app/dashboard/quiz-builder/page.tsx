"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  GripVertical,
  CheckSquare,
  ToggleLeft,
  AlignLeft,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Save,
  Eye,
  CalendarIcon,
  Clock,
  Shuffle,
  BookCheck,
  Hash,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = "mcq" | "true_false" | "short_answer" | "essay";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const mcqOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Option text required"),
  isCorrect: z.boolean(),
});

const questionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("mcq"),
    id: z.string(),
    text: z.string().min(1, "Question text required"),
    marks: z.number({ error: "Required" }).min(0.5, "Min 0.5"),
    options: z
      .array(mcqOptionSchema)
      .min(2, "At least 2 options required")
      .refine((opts) => opts.some((o) => o.isCorrect), {
        message: "Mark at least one correct answer",
      }),
    explanation: z.string().optional(),
  }),
  z.object({
    type: z.literal("true_false"),
    id: z.string(),
    text: z.string().min(1, "Question text required"),
    marks: z.number({ error: "Required" }).min(0.5, "Min 0.5"),
    correctAnswer: z.enum(["true", "false"]),
    explanation: z.string().optional(),
  }),
  z.object({
    type: z.literal("short_answer"),
    id: z.string(),
    text: z.string().min(1, "Question text required"),
    marks: z.number({ error: "Required" }).min(0.5, "Min 0.5"),
    sampleAnswer: z.string().optional(),
    explanation: z.string().optional(),
  }),
  z.object({
    type: z.literal("essay"),
    id: z.string(),
    text: z.string().min(1, "Question text required"),
    marks: z.number({ error: "Required" }).min(0.5, "Min 0.5"),
    wordLimit: z.number().optional(),
    rubric: z.string().optional(),
    explanation: z.string().optional(),
  }),
]);

const quizFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  classId: z.string().min(1, "Select a class"),
  subject: z.string().min(1, "Select a subject"),
  dueDate: z.date({ error: "Select a due date" }),
  timeLimitEnabled: z.boolean(),
  timeLimitMinutes: z.number().min(1).max(300).optional(),
  shuffleQuestions: z.boolean(),
  showAnswersAfter: z.boolean(),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;
type Question = z.infer<typeof questionSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CLASSES = [
  { id: "cls-1", label: "Grade 10 – A · Mathematics" },
  { id: "cls-2", label: "Grade 10 – B · Mathematics" },
  { id: "cls-3", label: "Grade 9 – A · Science" },
  { id: "cls-4", label: "Grade 11 – C · Physics" },
];

const MOCK_SUBJECTS = [
  "Mathematics",
  "Science",
  "Physics",
  "English",
  "History",
];

// ─── Config ───────────────────────────────────────────────────────────────────

const QUESTION_TYPE_CONFIG: Record<
  QuestionType,
  { label: string; icon: React.ReactNode; color: string; description: string }
> = {
  mcq: {
    label: "Multiple Choice",
    icon: <CheckSquare className="w-4 h-4" />,
    color:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
    description: "One or more correct options",
  },
  true_false: {
    label: "True / False",
    icon: <ToggleLeft className="w-4 h-4" />,
    color:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800",
    description: "Binary true or false answer",
  },
  short_answer: {
    label: "Short Answer",
    icon: <AlignLeft className="w-4 h-4" />,
    color:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    description: "Brief written response",
  },
  essay: {
    label: "Essay",
    icon: <FileText className="w-4 h-4" />,
    color:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    description: "Long-form written response",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeQuestion(type: QuestionType): Question {
  const base = { id: newId(), text: "", marks: 1, explanation: "" };
  switch (type) {
    case "mcq":
      return {
        ...base,
        type: "mcq",
        options: [
          { id: newId(), text: "", isCorrect: false },
          { id: newId(), text: "", isCorrect: false },
          { id: newId(), text: "", isCorrect: false },
          { id: newId(), text: "", isCorrect: false },
        ],
      };
    case "true_false":
      return { ...base, type: "true_false", correctAnswer: "true" };
    case "short_answer":
      return { ...base, type: "short_answer", sampleAnswer: "" };
    case "essay":
      return { ...base, type: "essay", wordLimit: undefined, rubric: "" };
  }
}

// ─── Question Card ────────────────────────────────────────────────────────────

function QuestionCard({
  index,
  form,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  index: number;
  form: any;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const question = form.watch(`questions.${index}`);
  const type: QuestionType = question?.type ?? "mcq";
  const cfg = QUESTION_TYPE_CONFIG[type];
  const marks = question?.marks ?? 0;
  const hasText = !!question?.text?.trim();

  // MCQ options field array — must be called unconditionally
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `questions.${index}.options`,
  });

  return (
    <Card
      className={cn("border-l-4 transition-all duration-150", {
        "border-l-violet-400": type === "mcq",
        "border-l-sky-400": type === "true_false",
        "border-l-amber-400": type === "short_answer",
        "border-l-emerald-400": type === "essay",
      })}
    >
      {/* Card header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
        <span className="w-5 font-mono text-muted-foreground text-xs shrink-0">
          Q{index + 1}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 border rounded-md font-medium text-xs shrink-0",
            cfg.color,
          )}
        >
          {cfg.icon}
          {cfg.label}
        </span>
        {hasText && (
          <span className="hidden sm:block flex-1 text-muted-foreground text-sm truncate">
            {question.text}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <Badge variant="secondary" className="hidden sm:flex text-xs">
            <Hash className="mr-0.5 w-2.5 h-2.5" />
            {marks} mark{marks !== 1 ? "s" : ""}
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={onDuplicate}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10 w-7 h-7 hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {!collapsed && (
        <CardContent className="space-y-4 p-4">
          {/* Question text + marks row */}
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name={`questions.${index}.text`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-muted-foreground text-xs">
                    Question
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your question…"
                      className="text-sm resize-none"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`questions.${index}.marks`}
              render={({ field }) => (
                <FormItem className="w-20 shrink-0">
                  <FormLabel className="text-muted-foreground text-xs">
                    Marks
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      className="text-sm text-center"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* MCQ options */}
          {type === "mcq" && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">
                Answer Options
              </Label>
              {optionFields.map((optField, optIdx) => {
                const isCorrect = form.watch(
                  `questions.${index}.options.${optIdx}.isCorrect`,
                );
                return (
                  <div key={optField.id} className="flex items-center gap-2">
                    <Controller
                      control={form.control}
                      name={`questions.${index}.options.${optIdx}.isCorrect`}
                      render={({ field: f }) => (
                        <button
                          type="button"
                          onClick={() => f.onChange(!f.value)}
                          className={cn(
                            "border-2 rounded-full w-5 h-5 transition-colors shrink-0",
                            f.value
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-border bg-background",
                          )}
                        >
                          {f.value && (
                            <CheckCircle2 className="p-0.5 w-full h-full text-white" />
                          )}
                        </button>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`questions.${index}.options.${optIdx}.text`}
                      render={({ field: f }) => (
                        <Input
                          {...f}
                          placeholder={`Option ${optIdx + 1}`}
                          className={cn(
                            "flex-1 h-8 text-sm transition-colors",
                            isCorrect &&
                              "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/30",
                          )}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() =>
                        optionFields.length > 2 && removeOption(optIdx)
                      }
                      disabled={optionFields.length <= 2}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                );
              })}
              {/* Validation error for options */}
              {form.formState.errors?.questions?.[index]?.options && (
                <p className="flex items-center gap-1 text-destructive text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {(form.formState.errors.questions[index].options as any)
                    ?.message ?? "Check options"}
                </p>
              )}
              {optionFields.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() =>
                    appendOption({ id: newId(), text: "", isCorrect: false })
                  }
                >
                  <Plus className="mr-1 w-3 h-3" /> Add Option
                </Button>
              )}
            </div>
          )}

          {/* True / False */}
          {type === "true_false" && (
            <FormField
              control={form.control}
              name={`questions.${index}.correctAnswer`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs">
                    Correct Answer
                  </FormLabel>
                  <div className="flex gap-2">
                    {(["true", "false"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => field.onChange(val)}
                        className={cn(
                          "flex-1 px-4 py-2 border rounded-lg font-medium text-sm capitalize transition-all",
                          field.value === val
                            ? val === "true"
                              ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "border-border hover:bg-muted",
                        )}
                      >
                        {val === "true" ? "✓ True" : "✗ False"}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Short Answer */}
          {type === "short_answer" && (
            <FormField
              control={form.control}
              name={`questions.${index}.sampleAnswer`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs">
                    Sample Answer{" "}
                    <span className="opacity-60 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Expected answer for reference…"
                      className="text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Essay */}
          {type === "essay" && (
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`questions.${index}.wordLimit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs">
                      Word Limit{" "}
                      <span className="opacity-60 font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={10}
                        placeholder="e.g. 500"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        className="text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`questions.${index}.rubric`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs">
                      Rubric / Marking Guide{" "}
                      <span className="opacity-60 font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Brief rubric notes…"
                        className="text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Explanation (all types) */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                <ChevronDown className="w-3 h-3" />
                Explanation / Hint{" "}
                <span className="opacity-60">(optional)</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <FormField
                control={form.control}
                name={`questions.${index}.explanation`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Explain the answer or provide a hint shown after submission…"
                        className="text-sm resize-none"
                        rows={2}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function QuizBuilderPage() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      classId: "",
      subject: "",
      timeLimitEnabled: false,
      timeLimitMinutes: 30,
      shuffleQuestions: false,
      showAnswersAfter: true,
      questions: [makeQuestion("mcq")],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const watchTimeLimitEnabled = form.watch("timeLimitEnabled");
  const watchQuestions = form.watch("questions");

  const totalMarks = watchQuestions.reduce((sum, q) => sum + (q.marks ?? 0), 0);
  const questionCount = fields.length;

  function addQuestion(type: QuestionType) {
    append(makeQuestion(type) as any);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  }

  function duplicateQuestion(index: number) {
    const q = form.getValues(`questions.${index}`);
    append({ ...q, id: newId() } as any);
  }

  async function handleSave(publish: boolean) {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fix the errors before saving");
      return;
    }
    const values = form.getValues();
    if (publish) setIsPublishing(true);
    else setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    console.log(publish ? "Published:" : "Draft saved:", values);
    if (publish) setIsPublishing(false);
    else setIsSaving(false);
    toast.success(publish ? "Quiz published!" : "Draft saved", {
      description: `${questionCount} questions · ${totalMarks} marks total`,
    });
  }

  return (
    <div className="space-y-6 mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">
            Quiz Builder
          </h1>
          <p className="mt-0.5 text-muted-foreground text-sm">
            Create and configure a quiz or assessment for your class.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="hidden sm:flex gap-1">
            <Hash className="w-3 h-3" />
            {questionCount} Q
          </Badge>
          <Badge variant="secondary" className="hidden sm:flex gap-1">
            <BookCheck className="w-3 h-3" />
            {totalMarks} marks
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {/* ── Section 1: Quiz Info ─────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Chapter 5 – Algebra Quiz"
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Instructions or context for students…"
                        className="text-sm resize-none"
                        rows={2}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to Class</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select class…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MOCK_CLASSES.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select subject…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MOCK_SUBJECTS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Due date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start w-full sm:w-[220px] font-normal text-sm text-left",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 w-4 h-4 shrink-0" />
                            {field.value
                              ? format(field.value, "dd MMM yyyy")
                              : "Pick a due date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Section 2: Settings ──────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Time limit */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Time Limit</p>
                    <p className="text-muted-foreground text-xs">
                      Set a countdown timer for the quiz
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {watchTimeLimitEnabled && (
                    <FormField
                      control={form.control}
                      name="timeLimitMinutes"
                      render={({ field }) => (
                        <FormItem className="m-0">
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              min={1}
                              max={300}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 30)
                              }
                              className="w-16 h-8 text-xs text-center"
                            />
                            <span className="text-muted-foreground text-xs">
                              min
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="timeLimitEnabled"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Shuffle */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-lg">
                    <Shuffle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Shuffle Questions</p>
                    <p className="text-muted-foreground text-xs">
                      Randomise question order per student
                    </p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="shuffleQuestions"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Show answers */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-lg">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Show Answers After Submission
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Let students review correct answers once submitted
                    </p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="showAnswersAfter"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Section 3: Questions ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-base">Questions</h2>
                <p className="mt-0.5 text-muted-foreground text-xs">
                  {questionCount} question{questionCount !== 1 ? "s" : ""} ·{" "}
                  {totalMarks} marks total
                </p>
              </div>
            </div>

            {/* Question list */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <QuestionCard
                  key={field.id}
                  index={index}
                  form={form}
                  onRemove={() => fields.length > 1 && remove(index)}
                  onDuplicate={() => duplicateQuestion(index)}
                  onMoveUp={() => index > 0 && move(index, index - 1)}
                  onMoveDown={() =>
                    index < fields.length - 1 && move(index, index + 1)
                  }
                  isFirst={index === 0}
                  isLast={index === fields.length - 1}
                />
              ))}
            </div>

            {/* Top-level questions error */}
            {form.formState.errors.questions?.root && (
              <p className="flex items-center gap-1.5 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {form.formState.errors.questions.root.message}
              </p>
            )}

            {/* Add question buttons */}
            <div className="space-y-3 p-4 border border-dashed rounded-xl">
              <p className="font-medium text-muted-foreground text-xs text-center">
                Add a question
              </p>
              <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {(Object.keys(QUESTION_TYPE_CONFIG) as QuestionType[]).map(
                  (type) => {
                    const cfg = QUESTION_TYPE_CONFIG[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addQuestion(type)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 hover:shadow-sm px-3 py-3 border rounded-lg font-medium text-xs transition-all",
                          cfg.color,
                        )}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* ── Sticky footer ────────────────────────────────────────────────── */}
          <div className="bottom-4 sticky flex justify-between items-center gap-4 bg-card shadow-md px-4 py-3 border rounded-xl">
            <div className="hidden sm:block text-muted-foreground text-xs">
              {questionCount} questions · {totalMarks} marks
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() => handleSave(false)}
              >
                <Save className="mr-1.5 w-3.5 h-3.5" />
                {isSaving ? "Saving…" : "Save Draft"}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPublishing}
                onClick={() => handleSave(true)}
              >
                <BookCheck className="mr-1.5 w-3.5 h-3.5" />
                {isPublishing ? "Publishing…" : "Publish Quiz"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
