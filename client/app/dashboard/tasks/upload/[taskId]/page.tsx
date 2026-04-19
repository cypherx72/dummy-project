"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { format, isPast, isToday } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  ArrowLeft,
  Trophy,
  Star,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Send,
  Trash2,
  Link,
} from "lucide-react";
// remove comment
import { AssignmentFormValues, AssignmentSchema } from "@/config/ZodSchema";
import { showToast } from "@/components/ui/toast";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { cn } from "@/lib/utils";
import { handleFileSubmit } from "../../uploadToCloudinary";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubmissionType = "fileUpload" | "textEntry" | "websiteUrl";
type AssignmentStatus = "pending" | "submitted" | "graded" | "late" | "missed";

interface Submission {
  id: string;
  status: AssignmentStatus;
  marksObtained?: number;
  feedback?: string;
  submittedAt: string;
  submittedText?: string;
  attachments: {
    id: string;
    cloudinary_url: string;
    name: string;
    file_extension: string;
    size: number;
  }[];
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
  postedDate: string;
  maxMarks: number;
  priority: string;
  submissionType: SubmissionType;
  allowLateSubmission: boolean;
  teacher: { id: string; name: string };
  course: { id: string; title: string };
  submissions: Submission[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMs(raw: string): Date {
  const n = Number(raw);
  return isNaN(n) ? new Date(raw) : new Date(n);
}

function getStatus(a: Assignment): AssignmentStatus {
  const sub = a.submissions[0];
  if (sub) return sub.status;
  const due = parseMs(a.dueDate);
  return isPast(due) && !isToday(due) ? "missed" : "pending";
}

const STATUS_CFG: Record<
  AssignmentStatus,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock3 className="w-3.5 h-3.5" />,
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  submitted: {
    label: "Submitted",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  graded: {
    label: "Graded",
    icon: <Star className="w-3.5 h-3.5" />,
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  late: {
    label: "Late",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  },
  missed: {
    label: "Missed",
    icon: <XCircle className="w-3.5 h-3.5" />,
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-zinc-300 text-right">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssignmentSubmitPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;

  const {
    fetchAssignmentsData,
    fetchAssignments,
    uploadConfig,
    getUploadSignature,
    submitAssignment,
  } = useAssignmentUI();

  // Derive assignment from context
  const assignment: Assignment | null = (() => {
    const list: Assignment[] =
      fetchAssignmentsData?.GetAssignments?.assignments ?? [];
    return list.find((a) => a.id === taskId) ?? null;
  })();

  useEffect(() => {
    if (!fetchAssignmentsData) fetchAssignments();
  }, [fetchAssignmentsData, fetchAssignments]);

  const status = assignment ? getStatus(assignment) : null;
  const submission = assignment?.submissions[0] ?? null;
  const canSubmit = status === "pending" || status === "late";
  const isGraded = status === "graded";

  // ── React Hook Form ────────────────────────────────────────────────────────

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(AssignmentSchema),
    defaultValues: {
      submissionType: assignment?.submissionType ?? "fileUpload",
      attachments: undefined,
      text: "",
      url: "",
    },
  });

  // Sync submissionType default once assignment loads
  useEffect(() => {
    if (assignment?.submissionType) {
      form.setValue("submissionType", assignment.submissionType);
    }
  }, [assignment?.submissionType]);

  const activeTab = form.watch("submissionType");

  // ── Submit handler ─────────────────────────────────────────────────────────

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      const results = await handleFileSubmit({
        data,
        configData: uploadConfig,
        fetchConfig: getUploadSignature,
      });

      const response = await submitAssignment({
        variables: {
          input: {
            attachments: results,
            textEntry: data.text,
            websiteUrl: data.url,
          },
        },
      });

      if (response?.data?.SubmitAssignment?.status === 200) {
        showToast(
          "Assignment submitted!",
          "Your work has been submitted successfully.",
          "success",
        );
      } else {
        import("@/components/ui/toast").then(({ errorToast }) =>
          errorToast(
            response?.data?.SubmitAssignment?.message ?? "Submission failed.",
          ),
        );
      }
    } catch (err) {
      showToast("Network error", "Unable to reach the server.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex justify-center m-auto p-6 w-3/4 h-full font-sans">
      <div className="w-full max-w-5xl">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row bg-muted shadow-md rounded-2xl h-full overflow-hidden"
        >
          {/* ── LEFT: Assignment details ──────────────────────────────────── */}
          <Card className="flex flex-col border-none rounded-2xl rounded-r-none w-1/2 h-full overflow-hidden">
            {!assignment ? (
              <CardContent className="flex flex-col gap-3 pt-6">
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="mt-2 w-full h-24" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
              </CardContent>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <CardHeader className="pb-2 shrink-0">
                  <div className="flex justify-between items-end gap-2">
                    <div className="space-y-4 min-w-0">
                      <CardTitle className="text-xl truncate first-letter:capitalize leading-snug">
                        {assignment.title}
                      </CardTitle>
                      <div className="flex flex-row items-start gap-2">
                        <Avatar className="size-10">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="flex flex-col gap-0">
                          <p className="font-semibold text-zinc-300">
                            Prof. {assignment.teacher.name}
                          </p>
                          <p className="font-normal text-zinc-400 capitalize">
                            {assignment.course.title}
                          </p>
                        </span>
                      </div>
                    </div>
                    {status && (
                      <Badge
                        className={cn(
                          "gap-1 text-sm shrink-0",
                          STATUS_CFG[status].badge,
                        )}
                      >
                        {STATUS_CFG[status].icon}
                        {STATUS_CFG[status].label}
                      </Badge>
                    )}
                  </div>

                  {isGraded && submission?.marksObtained !== undefined && (
                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 mt-2 px-3 py-2 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                      <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-800 dark:text-emerald-300 text-xs">
                          Scored {submission.marksObtained}/
                          {assignment.maxMarks} marks (
                          {Math.round(
                            (submission.marksObtained / assignment.maxMarks) *
                              100,
                          )}
                          %)
                        </p>
                        {submission.feedback && (
                          <p className="mt-0.5 text-emerald-700 dark:text-emerald-400 text-xs italic line-clamp-1">
                            {submission.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardHeader>

                <Separator />

                <div className="flex-1 space-y-4 py-3 overflow-y-auto no-scrollbar">
                  <div className="space-y-1.5 px-4">
                    <MetaRow
                      label="Posted"
                      value={format(
                        parseMs(assignment.postedDate),
                        "dd MMM yyyy",
                      )}
                    />
                    <MetaRow
                      label="Due"
                      value={format(parseMs(assignment.dueDate), "dd MMM yyyy")}
                    />
                    <MetaRow
                      label="Max marks"
                      value={`${assignment.maxMarks}`}
                    />
                    <MetaRow label="Priority" value={assignment.priority} />
                    <MetaRow
                      label="Submission type"
                      value={assignment.submissionType}
                    />
                    <MetaRow
                      label="Late allowed"
                      value={assignment.allowLateSubmission ? "Yes" : "No"}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-1 px-4">
                    <p className="font-medium text-muted-foreground uppercase tracking-wide">
                      Description
                    </p>
                    <p className="p-3 border rounded-xl leading-relaxed tracking-wide">
                      {assignment.description}
                    </p>
                  </div>

                  {assignment.instructions && (
                    <>
                      <Separator />
                      <div className="space-y-1 px-4">
                        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Instructions
                        </p>
                        <p className="text-sm leading-relaxed">
                          {assignment.instructions}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </Card>

          <Separator className="w-0.5" orientation="vertical" />

          {/* ── RIGHT: Submission panel ───────────────────────────────────── */}
          <Card className="flex flex-col justify-between border-none rounded-2xl rounded-l-none w-1/2 h-full">
            {canSubmit && assignment && (
              <div className="flex flex-col space-y-2 h-full overflow-hidden">
                <p className="px-4 pt-4 font-medium text-xl capitalize tracking-wide">
                  Your submission
                </p>
                <Separator />

                {/* submissionType drives the active tab — Controller keeps it in RHF state */}
                <Controller
                  name="submissionType"
                  control={form.control}
                  render={({ field }) => (
                    <Tabs
                      className="flex flex-col flex-1 px-3 pb-3 overflow-hidden"
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                      }}
                    >
                      <TabsList className="w-full">
                        <TabsTrigger
                          value="fileUpload"
                          className="flex-1 text-xs"
                        >
                          File upload
                        </TabsTrigger>
                        <TabsTrigger
                          value="textEntry"
                          className="flex-1 text-xs"
                        >
                          Text entry
                        </TabsTrigger>
                        <TabsTrigger
                          value="websiteUrl"
                          className="flex-1 text-xs"
                        >
                          Website URL
                        </TabsTrigger>
                      </TabsList>

                      {/* ── File upload ── */}
                      <TabsContent value="fileUpload" className="flex-1 mt-3">
                        <Controller
                          name="attachments"
                          control={form.control}
                          render={({ field: fileField, fieldState }) => (
                            <Card
                              data-invalid={fieldState.invalid}
                              className="flex flex-col justify-between border border-blue-500 data-[invalid=true]:border-destructive border-dashed rounded-2xl h-full transition-colors"
                              onDrop={(e) => {
                                e.preventDefault();
                                const dropped = e.dataTransfer.files[0];
                                if (dropped) fileField.onChange(dropped);
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <CardContent className="flex flex-col flex-1 justify-center items-center gap-y-4 pt-8">
                                <FaCloudUploadAlt className="block size-12 text-blue-400" />
                                <p className="font-semibold text-2xl">
                                  Drop file here
                                </p>
                                <p className="font-semibold text-gray-500 text-xl">
                                  or
                                </p>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="lg"
                                >
                                  <label
                                    htmlFor="fileUpload"
                                    className="cursor-pointer"
                                  >
                                    Browse file
                                    <input
                                      type="file"
                                      id="fileUpload"
                                      className="hidden"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) fileField.onChange(f);
                                      }}
                                    />
                                  </label>
                                </Button>

                                {/* Selected file pill */}
                                {fileField.value instanceof File && (
                                  <div className="flex items-center gap-2 bg-background px-3 py-1.5 border rounded-md max-w-[220px]">
                                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span className="text-sm truncate">
                                      {fileField.value.name}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      onClick={() =>
                                        fileField.onChange(undefined)
                                      }
                                      className="ml-auto text-muted-foreground hover:text-destructive shrink-0"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                )}

                                {fieldState.error && (
                                  <Alert className="border-destructive/40 max-w-xs">
                                    <AlertDescription className="text-destructive text-sm">
                                      {/* params.messages gives you the array, fallback to single message */}
                                      {(fieldState.error as any).types?.messages
                                        ? (
                                            fieldState.error as any
                                          ).types.messages.map(
                                            (err: string, i: number) => (
                                              <div key={i}>{err}</div>
                                            ),
                                          )
                                        : fieldState.error.message}
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        />
                      </TabsContent>

                      {/* ── Text entry ── */}
                      <TabsContent value="textEntry" className="mt-3">
                        <Controller
                          name="text"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-1">
                              <Textarea
                                {...field}
                                data-invalid={fieldState.invalid}
                                rows={5}
                                placeholder="Type your answer here…"
                                maxLength={2000}
                                className="p-2 pt-1 border data-[invalid=true]:border-destructive focus-visible:ring-0 min-h-84 max-h-96 leading-6 tracking-wider transition-colors no-scrollbar"
                              />
                              <div className="flex justify-between items-center">
                                {fieldState.error ? (
                                  <p className="text-destructive text-xs">
                                    {fieldState.error.message}
                                  </p>
                                ) : (
                                  <span />
                                )}
                                <p className="text-muted-foreground text-xs">
                                  {field.value?.length ?? 0} / 2000
                                </p>
                              </div>
                            </div>
                          )}
                        />
                      </TabsContent>

                      {/* ── Website URL ── */}
                      <TabsContent value="websiteUrl" className="mt-3">
                        <Controller
                          name="url"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                              <div className="relative">
                                <Link className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />
                                <Input
                                  {...field}
                                  data-invalid={fieldState.invalid}
                                  type="url"
                                  placeholder="https://github.com/you/project"
                                  className="pl-9 data-[invalid=true]:border-destructive transition-colors"
                                />
                              </div>
                              {fieldState.error ? (
                                <p className="text-destructive text-xs">
                                  {fieldState.error.message}
                                </p>
                              ) : (
                                <p className="text-muted-foreground text-xs">
                                  Link to a GitHub repo, Google Doc, Figma file,
                                  or any public URL.
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                />
              </div>
            )}

            {/* Already submitted / graded view */}
            {(status === "submitted" || isGraded) && submission && (
              <div className="space-y-1 px-4 py-3">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Submitted
                </p>
                {submission.submittedText && (
                  <p className="text-sm line-clamp-4 leading-relaxed">
                    {submission.submittedText}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  {format(
                    parseMs(submission.submittedAt),
                    "dd MMM yyyy, HH:mm",
                  )}
                </p>
              </div>
            )}

            <CardFooter className="justify-end gap-3 pt-3 pb-4 border-t shrink-0">
              {canSubmit ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => form.reset()}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={form.formState.isSubmitting}
                    className="gap-1.5 bg-green-400"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {form.formState.isSubmitting ? "Submitting…" : "Submit"}
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {status === "missed"
                    ? "Submission window closed."
                    : "Already submitted."}
                </p>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
