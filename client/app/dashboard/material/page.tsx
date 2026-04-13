"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  FileText,
  Video,
  Link2,
  Presentation,
  BookOpen,
  Plus,
  Search,
  Upload,
  CalendarIcon,
  Eye,
  Users,
  UserCheck,
  Clock,
  Trash2,
  Pencil,
  ExternalLink,
  Download,
  Filter,
  MoreHorizontal,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Save,
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  Globe,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { showToast, errorToast } from "@/components/ui/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type MaterialType = "note" | "slide" | "video" | "link" | "lesson_plan";
type Visibility = "students" | "parents" | "both";

interface Material {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  class: string;
  subject: string;
  visibility: Visibility;
  scheduledAt: string | null;
  publishedAt: string | null;
  fileUrl?: string;
  linkUrl?: string;
  status: "draft" | "scheduled" | "published";
  // lesson plan extras
  objectives?: string;
  topicsCovered?: string;
  resourcesNeeded?: string;
  activities?: Activity[];
  homework?: string;
}

interface Activity {
  id: string;
  title: string;
  durationMinutes: number;
  description: string;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const activitySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Activity title required"),
  durationMinutes: z.number().min(1, "Min 1 min").max(300),
  description: z.string().optional(),
});

const materialFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["note", "slide", "video", "link", "lesson_plan"]),
  classId: z.string().min(1, "Select a class"),
  subject: z.string().min(1, "Select a subject"),
  visibility: z.enum(["students", "parents", "both"]),
  scheduledAt: z.date().optional(),
  linkUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  // lesson plan fields
  objectives: z.string().optional(),
  topicsCovered: z.string().optional(),
  resourcesNeeded: z.string().optional(),
  activities: z.array(activitySchema).optional(),
  homework: z.string().optional(),
});

type MaterialFormValues = z.infer<typeof materialFormSchema>;

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

const MOCK_MATERIALS: Material[] = [
  {
    id: "m1",
    title: "Quadratic Equations – Summary Notes",
    description:
      "Comprehensive notes covering factoring, completing the square, and the quadratic formula.",
    type: "note",
    class: "Grade 10 – A",
    subject: "Mathematics",
    visibility: "students",
    scheduledAt: null,
    publishedAt: "2025-01-10",
    status: "published",
  },
  {
    id: "m2",
    title: "Algebra Unit – Slide Deck",
    description:
      "Presentation slides for Chapter 5 covering linear and quadratic expressions.",
    type: "slide",
    class: "Grade 10 – B",
    subject: "Mathematics",
    visibility: "both",
    scheduledAt: null,
    publishedAt: "2025-01-12",
    status: "published",
  },
  {
    id: "m3",
    title: "Chemical Reactions – Explainer Video",
    description:
      "Embedded video walkthrough of oxidation and reduction reactions.",
    type: "video",
    class: "Grade 9 – A",
    subject: "Science",
    visibility: "students",
    scheduledAt: null,
    publishedAt: "2025-01-08",
    status: "published",
    linkUrl: "https://youtube.com",
  },
  {
    id: "m4",
    title: "Khan Academy – Newton's Laws",
    description:
      "Curated external resource for supplementary reading on Newton's three laws.",
    type: "link",
    class: "Grade 11 – C",
    subject: "Physics",
    visibility: "students",
    scheduledAt: "2025-01-25",
    publishedAt: null,
    status: "scheduled",
    linkUrl: "https://khanacademy.org",
  },
  {
    id: "m5",
    title: "Lesson Plan – Forces & Motion",
    description:
      "Full lesson plan for the 60-minute introductory class on forces.",
    type: "lesson_plan",
    class: "Grade 11 – C",
    subject: "Physics",
    visibility: "both",
    scheduledAt: null,
    publishedAt: "2025-01-14",
    status: "published",
    objectives:
      "Students will understand Newton's First and Second Laws and apply F=ma.",
    topicsCovered: "Inertia, Net Force, Acceleration, Free Body Diagrams",
    resourcesNeeded: "Whiteboard, toy cars, spring scales, printed worksheet",
    activities: [
      {
        id: "a1",
        title: "Warm-up – Review Q&A",
        durationMinutes: 5,
        description: "Quick recall questions on last lesson.",
      },
      {
        id: "a2",
        title: "Direct Instruction",
        durationMinutes: 20,
        description: "Explain Newton's 1st & 2nd laws with diagrams.",
      },
      {
        id: "a3",
        title: "Hands-on Activity",
        durationMinutes: 25,
        description:
          "Students push toy cars with measured forces and record results.",
      },
      {
        id: "a4",
        title: "Debrief & Discussion",
        durationMinutes: 10,
        description: "Share findings and correct misconceptions.",
      },
    ],
    homework: "Complete worksheet Q1–Q10. Read textbook pp. 78–82.",
  },
  {
    id: "m6",
    title: "Lesson Plan – Quadratic Functions",
    description:
      "Draft lesson plan for upcoming quadratic functions introduction.",
    type: "lesson_plan",
    class: "Grade 10 – A",
    subject: "Mathematics",
    visibility: "students",
    scheduledAt: null,
    publishedAt: null,
    status: "draft",
    objectives: "Introduce the standard form of a quadratic and its graph.",
    topicsCovered: "Parabola, Vertex, Axis of Symmetry",
    resourcesNeeded: "Graph paper, calculator",
    activities: [],
    homework: "",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  MaterialType,
  { label: string; icon: React.ReactNode; color: string; accept?: string }
> = {
  note: {
    label: "Note / Doc",
    icon: <FileText className="w-4 h-4" />,
    color:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
    accept: ".pdf,.doc,.docx,.txt",
  },
  slide: {
    label: "Presentation",
    icon: <Presentation className="w-4 h-4" />,
    color:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800",
    accept: ".ppt,.pptx,.pdf",
  },
  video: {
    label: "Video",
    icon: <Video className="w-4 h-4" />,
    color:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
  },
  link: {
    label: "External Link",
    icon: <Link2 className="w-4 h-4" />,
    color:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  },
  lesson_plan: {
    label: "Lesson Plan",
    icon: <BookOpen className="w-4 h-4" />,
    color:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  },
};

const VISIBILITY_CONFIG: Record<
  Visibility,
  { label: string; icon: React.ReactNode }
> = {
  students: { label: "Students only", icon: <Users className="w-3.5 h-3.5" /> },
  parents: {
    label: "Parents only",
    icon: <UserCheck className="w-3.5 h-3.5" />,
  },
  both: {
    label: "Students & Parents",
    icon: <Globe className="w-3.5 h-3.5" />,
  },
};

const STATUS_CONFIG: Record<
  Material["status"],
  { label: string; color: string }
> = {
  published: {
    label: "Published",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
};

const ALL_TYPES: (MaterialType | "all")[] = [
  "all",
  "note",
  "slide",
  "video",
  "link",
  "lesson_plan",
];

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Material Card ────────────────────────────────────────────────────────────

function MaterialCard({
  material,
  onEdit,
  onDelete,
  onView,
}: {
  material: Material;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const typeCfg = TYPE_CONFIG[material.type];
  const statusCfg = STATUS_CONFIG[material.status];
  const visCfg = VISIBILITY_CONFIG[material.visibility];

  return (
    <Card className="group hover:shadow-md hover:border-primary/30 transition-all duration-150">
      <CardContent className="space-y-3 p-4">
        {/* Top badges */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 border rounded-md font-medium text-xs",
                typeCfg.color,
              )}
            >
              {typeCfg.icon}
              {typeCfg.label}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md font-medium text-xs",
                statusCfg.color,
              )}
            >
              {statusCfg.label}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 w-7 h-7 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 w-3.5 h-3.5" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 w-3.5 h-3.5" /> Edit
              </DropdownMenuItem>
              {material.linkUrl && (
                <DropdownMenuItem asChild>
                  <a
                    href={material.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 w-3.5 h-3.5" /> Open Link
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 w-3.5 h-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title + description */}
        <div>
          <p
            className="font-semibold hover:text-primary text-sm line-clamp-2 leading-snug transition-colors cursor-pointer"
            onClick={onView}
          >
            {material.title}
          </p>
          {material.description && (
            <p className="mt-1 text-muted-foreground text-xs line-clamp-2">
              {material.description}
            </p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex justify-between items-center gap-2 text-muted-foreground text-xs">
          <span className="truncate">
            {material.class} · {material.subject}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            {visCfg.icon}
            <span className="hidden sm:inline">{visCfg.label}</span>
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {material.status === "published" &&
            material.publishedAt &&
            `Published ${format(new Date(material.publishedAt), "dd MMM yyyy")}`}
          {material.status === "scheduled" &&
            material.scheduledAt &&
            `Scheduled for ${format(new Date(material.scheduledAt), "dd MMM yyyy")}`}
          {material.status === "draft" && "Draft – not published"}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Lesson Plan Extra Fields ─────────────────────────────────────────────────

function LessonPlanFields({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  return (
    <div className="space-y-5 pt-2">
      <Separator />
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
        Lesson Plan Details
      </p>

      {/* Objectives */}
      <FormField
        control={form.control}
        name="objectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Learning Objectives</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="What will students be able to do by the end of the lesson?"
                rows={2}
                className="text-sm resize-none"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Topics covered */}
      <FormField
        control={form.control}
        name="topicsCovered"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topics Covered</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g. Forces, Newton's Laws, Free Body Diagrams"
                className="text-sm"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Resources needed */}
      <FormField
        control={form.control}
        name="resourcesNeeded"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Resources / Materials Needed</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g. Whiteboard, worksheets, lab equipment"
                className="text-sm"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Activities */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <FormLabel>Activities & Timing</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              append({
                id: newId(),
                title: "",
                durationMinutes: 10,
                description: "",
              })
            }
          >
            <Plus className="mr-1 w-3 h-3" /> Add Activity
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="p-4 border border-dashed rounded-lg text-muted-foreground text-xs text-center">
            No activities yet. Add one to structure your lesson.
          </div>
        )}

        {fields.map((actField, actIdx) => (
          <Card key={actField.id} className="border-l-4 border-l-primary/30">
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                <span className="w-5 font-mono text-muted-foreground text-xs shrink-0">
                  {actIdx + 1}
                </span>
                <FormField
                  control={form.control}
                  name={`activities.${actIdx}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-1 m-0">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Activity title…"
                          className="h-7 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-1 shrink-0">
                  <FormField
                    control={form.control}
                    name={`activities.${actIdx}.durationMinutes`}
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                            className="w-14 h-7 text-xs text-center"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground text-xs">min</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 hover:text-destructive shrink-0"
                  onClick={() => remove(actIdx)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`activities.${actIdx}.description`}
                render={({ field }) => (
                  <FormItem className="m-0 pl-9">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Brief description of activity…"
                        className="h-7 text-xs"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        {fields.length > 0 && (
          <div className="text-muted-foreground text-xs text-right">
            Total:{" "}
            {fields.reduce((sum, _, i) => {
              const val = form.watch(`activities.${i}.durationMinutes`);
              return sum + (val || 0);
            }, 0)}{" "}
            min
          </div>
        )}
      </div>

      {/* Homework */}
      <FormField
        control={form.control}
        name="homework"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Homework / Follow-up</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Assignments or reading for after the lesson…"
                rows={2}
                className="text-sm resize-none"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

// ─── Upload / Edit Form Dialog ────────────────────────────────────────────────

function MaterialFormDialog({
  open,
  onClose,
  editMaterial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  editMaterial: Material | null;
  onSaved: (values: MaterialFormValues, publish: boolean) => void;
}) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "note",
      classId: "",
      subject: "",
      visibility: "students",
      linkUrl: "",
      objectives: "",
      topicsCovered: "",
      resourcesNeeded: "",
      activities: [],
      homework: "",
    },
  });

  // Populate form when editing
  React.useEffect(() => {
    if (editMaterial) {
      form.reset({
        title: editMaterial.title,
        description: editMaterial.description,
        type: editMaterial.type,
        classId:
          MOCK_CLASSES.find((c) =>
            editMaterial.class.startsWith(c.label.split("·")[0].trim()),
          )?.id ?? "",
        subject: editMaterial.subject,
        visibility: editMaterial.visibility,
        scheduledAt: editMaterial.scheduledAt
          ? new Date(editMaterial.scheduledAt)
          : undefined,
        linkUrl: editMaterial.linkUrl ?? "",
        objectives: editMaterial.objectives ?? "",
        topicsCovered: editMaterial.topicsCovered ?? "",
        resourcesNeeded: editMaterial.resourcesNeeded ?? "",
        activities: editMaterial.activities ?? [],
        homework: editMaterial.homework ?? "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        type: "note",
        classId: "",
        subject: "",
        visibility: "students",
        linkUrl: "",
        objectives: "",
        topicsCovered: "",
        resourcesNeeded: "",
        activities: [],
        homework: "",
      });
      setFileName(null);
    }
  }, [editMaterial, open]);

  const watchType = form.watch("type");
  const needsLink = watchType === "video" || watchType === "link";
  const needsFile = watchType === "note" || watchType === "slide";
  const isLessonPlan = watchType === "lesson_plan";

  async function handleSubmit(publish: boolean) {
    const valid = await form.trigger();
    if (!valid) return;
    const values = form.getValues();
    if (publish) setIsPublishing(true);
    else setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSaved(values, publish);
    if (publish) setIsPublishing(false);
    else setIsSaving(false);
    onClose();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editMaterial ? "Edit Material" : "Share New Material"}
          </DialogTitle>
          <DialogDescription>
            {editMaterial
              ? "Update the details below."
              : "Upload or link a resource to share with your class."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4 py-2">
            {/* Material type selector */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <div className="gap-2 grid grid-cols-3 sm:grid-cols-5">
                    {(Object.keys(TYPE_CONFIG) as MaterialType[]).map(
                      (type) => {
                        const cfg = TYPE_CONFIG[type];
                        const isActive = field.value === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 px-2 py-3 border rounded-lg font-medium text-xs transition-all",
                              isActive
                                ? cn(
                                    cfg.color,
                                    "ring-2 ring-offset-1 ring-current",
                                  )
                                : "border-border hover:bg-muted text-muted-foreground",
                            )}
                          >
                            {cfg.icon}
                            <span className="text-center leading-tight">
                              {cfg.label}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title + description */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Chapter 5 – Summary Notes"
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
                      placeholder="Brief description of this material…"
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Class + subject */}
            <div className="gap-4 grid grid-cols-2">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

            {/* File upload zone */}
            {needsFile && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-6 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30",
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={TYPE_CONFIG[watchType].accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFileName(file.name);
                  }}
                />
                {fileName ? (
                  <div className="flex justify-center items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">{fileName}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileName(null);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="mx-auto w-8 h-8 text-muted-foreground/50" />
                    <p className="font-medium text-muted-foreground text-sm">
                      Drop file here or{" "}
                      <span className="text-primary">browse</span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {TYPE_CONFIG[watchType].accept?.split(",").join(", ")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Link / video URL */}
            {needsLink && (
              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchType === "video" ? "Video URL" : "Link URL"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Link2 className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                        <Input
                          {...field}
                          placeholder="https://…"
                          className="pl-9 text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Visibility */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visible To</FormLabel>
                  <div className="gap-2 grid grid-cols-3">
                    {(Object.keys(VISIBILITY_CONFIG) as Visibility[]).map(
                      (v) => {
                        const cfg = VISIBILITY_CONFIG[v];
                        const isActive = field.value === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => field.onChange(v)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2.5 border rounded-lg font-medium text-xs transition-all",
                              isActive
                                ? "border-primary bg-primary/5 text-primary dark:bg-primary/10"
                                : "border-border hover:bg-muted text-muted-foreground",
                            )}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </button>
                        );
                      },
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule publish date */}
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Schedule Publish Date{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Leave empty to save as draft or publish immediately.
                  </FormDescription>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start w-[200px] font-normal text-sm text-left",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 w-4 h-4 shrink-0" />
                            {field.value
                              ? format(field.value, "dd MMM yyyy")
                              : "Pick a date…"}
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
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => field.onChange(undefined)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {/* Lesson plan extra fields */}
            {isLessonPlan && <LessonPlanFields form={form} />}
          </div>
        </Form>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => handleSubmit(false)}
          >
            <Save className="mr-1.5 w-3.5 h-3.5" />
            {isSaving ? "Saving…" : "Save Draft"}
          </Button>
          <Button
            size="sm"
            disabled={isPublishing}
            onClick={() => handleSubmit(true)}
          >
            <Send className="mr-1.5 w-3.5 h-3.5" />
            {isPublishing ? "Publishing…" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── View Detail Dialog ───────────────────────────────────────────────────────

function MaterialViewDialog({
  material,
  onClose,
}: {
  material: Material | null;
  onClose: () => void;
}) {
  if (!material) return null;
  const typeCfg = TYPE_CONFIG[material.type];
  const statusCfg = STATUS_CONFIG[material.status];
  const visCfg = VISIBILITY_CONFIG[material.visibility];
  const totalDuration =
    material.activities?.reduce((s, a) => s + a.durationMinutes, 0) ?? 0;

  return (
    <Dialog open={!!material} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap gap-2 mb-1">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 border rounded-md font-medium text-xs",
                typeCfg.color,
              )}
            >
              {typeCfg.icon} {typeCfg.label}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md font-medium text-xs",
                statusCfg.color,
              )}
            >
              {statusCfg.label}
            </span>
          </div>
          <DialogTitle className="text-lg">{material.title}</DialogTitle>
          <DialogDescription>
            {material.class} · {material.subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {material.description && (
            <p className="text-muted-foreground">{material.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              {visCfg.icon} {visCfg.label}
            </span>
            {material.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Published{" "}
                {format(new Date(material.publishedAt), "dd MMM yyyy")}
              </span>
            )}
            {material.scheduledAt && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> Scheduled{" "}
                {format(new Date(material.scheduledAt), "dd MMM yyyy")}
              </span>
            )}
          </div>

          {material.linkUrl && (
            <a
              href={material.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> Open Resource
            </a>
          )}

          {material.type === "lesson_plan" && (
            <div className="space-y-4 pt-2">
              <Separator />
              {material.objectives && (
                <div>
                  <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Objectives
                  </p>
                  <p className="text-sm">{material.objectives}</p>
                </div>
              )}
              {material.topicsCovered && (
                <div>
                  <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Topics Covered
                  </p>
                  <p className="text-sm">{material.topicsCovered}</p>
                </div>
              )}
              {material.resourcesNeeded && (
                <div>
                  <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Resources Needed
                  </p>
                  <p className="text-sm">{material.resourcesNeeded}</p>
                </div>
              )}
              {material.activities && material.activities.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Activities
                    </p>
                    <span className="text-muted-foreground text-xs">
                      {totalDuration} min total
                    </span>
                  </div>
                  <div className="space-y-2">
                    {material.activities.map((act, i) => (
                      <div
                        key={act.id}
                        className="flex gap-3 bg-muted/30 p-3 border rounded-lg"
                      >
                        <span className="mt-0.5 w-4 font-mono text-muted-foreground text-xs shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <p className="font-medium text-sm">{act.title}</p>
                            <Badge
                              variant="secondary"
                              className="text-xs shrink-0"
                            >
                              {act.durationMinutes} min
                            </Badge>
                          </div>
                          {act.description && (
                            <p className="mt-0.5 text-muted-foreground text-xs">
                              {act.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {material.homework && (
                <div>
                  <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Homework / Follow-up
                  </p>
                  <p className="text-sm">{material.homework}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function MaterialsPage() {
  const [materials, setMaterials] = React.useState<Material[]>(MOCK_MATERIALS);
  const [typeFilter, setTypeFilter] = React.useState<MaterialType | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = React.useState<
    Material["status"] | "all"
  >("all");
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editMaterial, setEditMaterial] = React.useState<Material | null>(null);
  const [viewMaterial, setViewMaterial] = React.useState<Material | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const filtered = materials.filter((m) => {
    const matchType = typeFilter === "all" || m.type === typeFilter;
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.class.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  function handleSaved(values: MaterialFormValues, publish: boolean) {
    const classLabel =
      MOCK_CLASSES.find((c) => c.id === values.classId)
        ?.label.split("·")[0]
        .trim() ?? "";
    const newMaterial: Material = {
      id: editMaterial?.id ?? newId(),
      title: values.title,
      description: values.description ?? "",
      type: values.type,
      class: classLabel,
      subject: values.subject,
      visibility: values.visibility,
      scheduledAt: values.scheduledAt
        ? format(values.scheduledAt, "yyyy-MM-dd")
        : null,
      publishedAt: publish ? format(new Date(), "yyyy-MM-dd") : null,
      status: values.scheduledAt
        ? "scheduled"
        : publish
          ? "published"
          : "draft",
      linkUrl: values.linkUrl || undefined,
      objectives: values.objectives,
      topicsCovered: values.topicsCovered,
      resourcesNeeded: values.resourcesNeeded,
      activities: values.activities,
      homework: values.homework,
    };
    if (editMaterial) {
      setMaterials((prev) =>
        prev.map((m) => (m.id === editMaterial.id ? newMaterial : m)),
      );
      showToast("Material updated", undefined, "success");
    } else {
      setMaterials((prev) => [newMaterial, ...prev]);
      toast.success(publish ? "Material published!" : "Draft saved", {
        description: values.title,
      });
    }
    setEditMaterial(null);
  }

  function handleDelete(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
    showToast("Material deleted", undefined, "success");
  }

  const counts = {
    published: materials.filter((m) => m.status === "published").length,
    scheduled: materials.filter((m) => m.status === "scheduled").length,
    draft: materials.filter((m) => m.status === "draft").length,
  };

  return (
    <div className="space-y-6 mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">
            Materials & Lesson Plans
          </h1>
          <p className="mt-0.5 text-muted-foreground text-sm">
            Share notes, slides, videos, links, and lesson plans with your
            classes.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditMaterial(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-1.5 w-4 h-4" /> Share Material
        </Button>
      </div>

      {/* Stats ribbon */}
      <div className="gap-3 grid grid-cols-3">
        {[
          {
            label: "Published",
            count: counts.published,
            dot: "bg-emerald-500",
          },
          { label: "Scheduled", count: counts.scheduled, dot: "bg-blue-500" },
          { label: "Drafts", count: counts.draft, dot: "bg-muted-foreground" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 bg-card p-3 border rounded-lg"
          >
            <div className={cn("rounded-full w-2 h-2 shrink-0", s.dot)} />
            <div>
              <p className="text-muted-foreground text-xs">{s.label}</p>
              <p className="font-semibold text-xl leading-tight">{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex sm:flex-row flex-col gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder="Search by title, subject, class…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as any)}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map((type) => {
          const isAll = type === "all";
          const cfg = isAll ? null : TYPE_CONFIG[type];
          const isActive = typeFilter === type;
          const count = isAll
            ? materials.length
            : materials.filter((m) => m.type === type).length;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 border rounded-full font-medium text-xs transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {cfg?.icon}
              {isAll ? "All" : cfg?.label}
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  isActive ? "bg-white/20" : "bg-muted",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MaterialCard
              key={m.id}
              material={m}
              onView={() => setViewMaterial(m)}
              onEdit={() => {
                setEditMaterial(m);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteId(m.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center bg-muted/30 py-16 border border-dashed rounded-lg text-center">
          <AlertCircle className="mb-3 w-10 h-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground text-sm">
            No materials match your filters
          </p>
          <Button
            variant="link"
            size="sm"
            className="mt-1"
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
              setSearch("");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Upload / edit form dialog */}
      <MaterialFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditMaterial(null);
        }}
        editMaterial={editMaterial}
        onSaved={handleSaved}
      />

      {/* View dialog */}
      <MaterialViewDialog
        material={viewMaterial}
        onClose={() => setViewMaterial(null)}
      />

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Material</DialogTitle>
            <DialogDescription>
              This will permanently remove the material. Students will lose
              access immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
