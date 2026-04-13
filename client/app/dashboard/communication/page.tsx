"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  Send,
  Users,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Video,
  AlertCircle,
  CheckCircle,
  Eye,
  Paperclip,
  X,
  MessageSquare,
  CalendarDays,
  Plus,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { showToast, errorToast } from "@/components/ui/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery, useMutation, gql } from "@apollo/client";

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements {
    GetAnnouncements {
      status
      announcements {
        id title content priority createdAt
        course { id name code }
        creator { id name image }
      }
    }
  }
`;

const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    CreateAnnouncement(input: $input) {
      status message code
      announcement { id title }
    }
  }
`;

const GET_MEETINGS = gql`
  query GetMeetings {
    GetMeetings {
      status
      meetings {
        id title description type startTime endTime location meetingLink createdAt
        course { id name code }
        creator { id name image }
      }
    }
  }
`;

const SCHEDULE_MEETING = gql`
  mutation ScheduleMeeting($input: ScheduleMeetingInput!) {
    ScheduleMeeting(input: $input) {
      status message code
      meeting { id title }
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Announcement {
  id: string;
  title: string;
  message: string;
  recipients: string;
  recipientCount: number;
  priority: "normal" | "urgent" | "important";
  attachments: string[];
  sentAt: string;
  readCount: number;
  totalRecipients: number;
  sentBy: string;
}

interface Meeting {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: "in-person" | "virtual";
  status: "available" | "booked" | "completed" | "cancelled";
  parentName?: string;
  studentName?: string;
  studentRoll?: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  meetingId?: string;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const announcementFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
  recipientType: z.enum([
    "all",
    "class",
    "specific_students",
    "specific_parents",
  ]),
  selectedRecipients: z.array(z.string()).optional(),
  priority: z.enum(["normal", "urgent", "important"]),
  attachments: z.array(z.string()).optional(),
});

const meetingFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.enum(["15", "30", "60"]),
  type: z.enum(["in-person", "virtual"]),
  location: z.string().optional(),
  meetingLink: z.string().url().optional().or(z.literal("")),
  maxSlots: z.string().min(1, "Number of slots required"),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;
type MeetingFormValues = z.infer<typeof meetingFormSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Parent-Teacher Meeting Next Week",
    message:
      "Dear Parents, we are organizing parent-teacher meetings next week. Please book your slots through the meetings section.",
    recipients: "All Parents - Grade 10A",
    recipientCount: 32,
    priority: "important",
    attachments: [],
    sentAt: "2025-01-15T10:30:00Z",
    readCount: 28,
    totalRecipients: 32,
    sentBy: "Mrs. Sharma",
  },
  {
    id: "a2",
    title: "Assignment Due Date Extended",
    message:
      "The Mathematics assignment due date has been extended to January 20th. Please submit on time.",
    recipients: "Grade 10A Students",
    recipientCount: 32,
    priority: "normal",
    attachments: [],
    sentAt: "2025-01-14T15:20:00Z",
    readCount: 30,
    totalRecipients: 32,
    sentBy: "Mrs. Sharma",
  },
  {
    id: "a3",
    title: "Urgent: School Closed Tomorrow",
    message:
      "Due to heavy rain forecast, school will remain closed tomorrow. Online classes will be conducted as per schedule.",
    recipients: "All Students & Parents",
    recipientCount: 120,
    priority: "urgent",
    attachments: [],
    sentAt: "2025-01-13T18:00:00Z",
    readCount: 115,
    totalRecipients: 120,
    sentBy: "Principal",
  },
];

const MOCK_MEETINGS: Meeting[] = [
  {
    id: "m1",
    date: "2025-01-22",
    startTime: "10:00",
    endTime: "10:30",
    duration: 30,
    type: "in-person",
    status: "booked",
    parentName: "Mr. Sharma",
    studentName: "Aarav Sharma",
    studentRoll: "10A-01",
    location: "Classroom 5A",
  },
  {
    id: "m2",
    date: "2025-01-22",
    startTime: "10:30",
    endTime: "11:00",
    duration: 30,
    type: "virtual",
    status: "booked",
    parentName: "Mrs. Patel",
    studentName: "Priya Patel",
    studentRoll: "10A-02",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "m3",
    date: "2025-01-22",
    startTime: "11:00",
    endTime: "11:30",
    duration: 30,
    type: "in-person",
    status: "available",
    location: "Classroom 5A",
  },
  {
    id: "m4",
    date: "2025-01-22",
    startTime: "14:00",
    endTime: "14:30",
    duration: 30,
    type: "virtual",
    status: "available",
  },
];

const PRIORITY_CONFIG = {
  normal: {
    label: "Normal",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    icon: <Bell className="w-3 h-3" />,
  },
  urgent: {
    label: "Urgent",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  important: {
    label: "Important",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    icon: <Bell className="w-3 h-3" />,
  },
};

const MEETING_STATUS_CONFIG = {
  available: {
    label: "Available",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  booked: {
    label: "Booked",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

// ─── Announcements Tab ────────────────────────────────────────────────────────

function AnnouncementsTab() {
  const [showForm, setShowForm] = React.useState(false);
  const [attachments, setAttachments] = React.useState<string[]>([]);

  const { data: announcementsData, refetch: refetchAnnouncements } = useQuery(GET_ANNOUNCEMENTS, {
    onError: () => errorToast("Failed to load announcements."),
  });

  const liveAnnouncements = announcementsData?.GetAnnouncements?.announcements ?? [];
  const displayAnnouncements = liveAnnouncements.length > 0 ? liveAnnouncements : MOCK_ANNOUNCEMENTS;

  const [createAnnouncementMutation] = useMutation(CREATE_ANNOUNCEMENT);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      message: "",
      recipientType: "all",
      selectedRecipients: [],
      priority: "normal",
      attachments: [],
    },
  });

  const recipientType = form.watch("recipientType");

  async function onSubmit(values: AnnouncementFormValues) {
    try {
      const res = await createAnnouncementMutation({
        variables: {
          input: {
            title: values.title,
            content: values.message,
            priority: values.priority,
          },
        },
      });
      if (res.data?.CreateAnnouncement?.status === 200) {
        showToast(
          "Announcement sent successfully",
          `Sent to ${values.recipientType === "all" ? "all recipients" : "selected recipients"}`,
          "success",
        );
        form.reset();
        setAttachments([]);
        setShowForm(false);
        refetchAnnouncements();
      } else {
        errorToast(res.data?.CreateAnnouncement?.message ?? "Failed to send announcement.");
      }
    } catch {
      errorToast("Failed to send announcement. Please try again.");
    }
  }

  function handleAttachment() {
    const fileName = `document_${Date.now()}.pdf`;
    setAttachments([...attachments, fileName]);
    showToast("Attachment added", fileName, "info");
  }

  function removeAttachment(index: number) {
    setAttachments(attachments.filter((_, i) => i !== index));
  }

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">New Announcement</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            data-testid="cancel-announcement-btn"
          >
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Announcement Details
                </CardTitle>
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
                          placeholder="e.g., Parent-Teacher Meeting Scheduled"
                          data-testid="announcement-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Type your announcement message here..."
                          className="min-h-[120px] resize-none"
                          data-testid="announcement-message"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/1000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="priority-selector">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(PRIORITY_CONFIG).map(
                            ([key, config]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {config.icon}
                                  {config.label}
                                </div>
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="recipientType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Send To</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <label
                              htmlFor="all"
                              className="font-normal text-sm cursor-pointer"
                            >
                              All Students & Parents (My Classes)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="class" id="class" />
                            <label
                              htmlFor="class"
                              className="font-normal text-sm cursor-pointer"
                            >
                              Specific Class
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="specific_students"
                              id="students"
                            />
                            <label
                              htmlFor="students"
                              className="font-normal text-sm cursor-pointer"
                            >
                              Selected Students Only
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="specific_parents"
                              id="parents"
                            />
                            <label
                              htmlFor="parents"
                              className="font-normal text-sm cursor-pointer"
                            >
                              Selected Parents Only
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {recipientType !== "all" && (
                  <div className="bg-muted/40 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs">
                      Selection interface will appear here based on recipient
                      type
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{file}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAttachment}
                  data-testid="add-attachment-btn"
                >
                  <Paperclip className="mr-2 w-4 h-4" />
                  Add Attachment
                </Button>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              data-testid="send-announcement-btn"
            >
              <Send className="mr-2 w-4 h-4" />
              Send Announcement
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">Announcements</h3>
          <p className="text-muted-foreground text-sm">
            Send announcements to students and parents
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          data-testid="new-announcement-btn"
        >
          <Plus className="mr-2 w-4 h-4" />
          New Announcement
        </Button>
      </div>

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-950 rounded-lg w-10 h-10">
                <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Sent</p>
                <p className="font-bold text-2xl">
                  {displayAnnouncements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-950 rounded-lg w-10 h-10">
                <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Avg Read Rate</p>
                <p className="font-bold text-2xl">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-amber-100 dark:bg-amber-950 rounded-lg w-10 h-10">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Urgent</p>
                <p className="font-bold text-2xl">
                  {
                    displayAnnouncements.filter((a: any) => a.priority === "urgent")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Announcements</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="divide-y">
            {displayAnnouncements.map((announcement: any) => {
              const priority = announcement.priority ?? "normal";
              const priorityConfig = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.normal;
              // Live data uses content; mock uses message. readCount/totalRecipients are mock-only.
              const messageText = announcement.content ?? announcement.message ?? "";
              const sentAt = announcement.createdAt ?? announcement.sentAt ?? new Date().toISOString();
              const recipients = announcement.course?.name ?? announcement.recipients ?? "All";
              const readCount = announcement.readCount ?? "—";
              const totalRecipients = announcement.totalRecipients ?? "—";
              const readPct = announcement.readCount != null && announcement.totalRecipients != null
                ? Math.round((announcement.readCount / announcement.totalRecipients) * 100)
                : null;

              return (
                <div
                  key={announcement.id}
                  className="hover:bg-muted/40 p-4 transition-colors"
                  data-testid={`announcement-${announcement.id}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start gap-2">
                        <h4 className="font-semibold text-sm">
                          {announcement.title}
                        </h4>
                        <Badge className={cn("text-[10px]", priorityConfig.color)}>
                          {priorityConfig.icon}
                          <span className="ml-1">{priorityConfig.label}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {messageText}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {recipients}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(sentAt), "dd MMM, HH:mm")}
                        </span>
                        {readPct !== null && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {readCount}/{totalRecipients} ({readPct}%)
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Messages Tab (Placeholder) ───────────────────────────────────────────────

function MessagesTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">Messages</h3>
        <p className="text-muted-foreground text-sm">
          Direct messaging with students and parents
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col justify-center items-center py-16 text-center">
          <MessageSquare className="mb-4 w-12 h-12 text-muted-foreground/50" />
          <h4 className="mb-2 font-semibold">Messaging Feature</h4>
          <p className="max-w-sm text-muted-foreground text-sm">
            Direct messaging functionality will be implemented here. This will
            allow real-time communication with students and parents.
          </p>
          <Button variant="outline" className="mt-4" disabled>
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Meetings Tab ─────────────────────────────────────────────────────────────

function MeetingsTab() {
  const [showForm, setShowForm] = React.useState(false);

  const { data: meetingsData, refetch: refetchMeetings } = useQuery(GET_MEETINGS, {
    onError: () => errorToast("Failed to load meetings."),
  });

  const [scheduleMeetingMutation] = useMutation(SCHEDULE_MEETING);

  const liveMeetings = meetingsData?.GetMeetings?.meetings ?? [];
  const displayMeetings = liveMeetings.length > 0 ? liveMeetings : MOCK_MEETINGS;

  const upcomingMeetings = displayMeetings.filter(
    (m: any) => m.status !== "completed" && (m.startTime ? new Date(m.startTime) >= new Date() : true),
  );
  const availableSlots = displayMeetings.filter((m: any) => m.status === "available");
  const bookedSlots = displayMeetings.filter((m: any) => m.status === "booked");

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      date: new Date(),
      startTime: "",
      duration: "30",
      type: "in-person",
      location: "",
      meetingLink: "",
      maxSlots: "1",
    },
  });

  const meetingType = form.watch("type");

  async function onSubmit(values: MeetingFormValues) {
    try {
      // Build startTime ISO from date + time fields
      const [hours, minutes] = values.startTime.split(":").map(Number);
      const start = new Date(values.date);
      start.setHours(hours, minutes, 0, 0);
      const end = new Date(start.getTime() + Number(values.duration) * 60000);

      const res = await scheduleMeetingMutation({
        variables: {
          input: {
            title: `Meeting – ${format(values.date, "dd MMM yyyy")} ${values.startTime}`,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            location: values.type === "in-person" ? values.location : null,
            meetingLink: values.type === "virtual" ? values.meetingLink : null,
            type: values.type === "virtual" ? "class" : "parent_meeting",
          },
        },
      });

      if (res.data?.ScheduleMeeting?.status === 200) {
        showToast(
          "Meeting slots created successfully",
          `${values.maxSlots} slot(s) created for ${format(values.date, "PPP")}`,
          "success",
        );
        form.reset();
        setShowForm(false);
        refetchMeetings();
      } else {
        errorToast(res.data?.ScheduleMeeting?.message ?? "Failed to create meeting.");
      }
    } catch {
      errorToast("Failed to create meeting. Please try again.");
    }
  }

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Create Time Slots</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            data-testid="cancel-meeting-btn"
          >
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Meeting Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        className="border rounded-md"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="gap-4 grid grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" data-testid="start-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="duration-selector">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maxSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Slots</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="10" placeholder="e.g., 5" data-testid="max-slots" />
                      </FormControl>
                      <FormDescription>How many consecutive time slots to create</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Type</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="in-person" id="in-person" />
                            <label htmlFor="in-person" className="flex items-center gap-2 font-normal text-sm cursor-pointer">
                              <MapPin className="w-4 h-4" /> In-Person
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="virtual" id="virtual" />
                            <label htmlFor="virtual" className="flex items-center gap-2 font-normal text-sm cursor-pointer">
                              <Video className="w-4 h-4" /> Virtual
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {meetingType === "in-person" && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Classroom 5A" data-testid="location-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {meetingType === "virtual" && (
                  <FormField
                    control={form.control}
                    name="meetingLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Link (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., https://meet.google.com/..." data-testid="meeting-link-input" />
                        </FormControl>
                        <FormDescription>Leave empty to generate automatically</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" data-testid="create-slots-btn">
              <Plus className="mr-2 w-4 h-4" />
              Create Time Slots
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">Parent-Teacher Meetings</h3>
          <p className="text-muted-foreground text-sm">Manage meeting schedules and availability</p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="create-slots-btn">
          <Plus className="mr-2 w-4 h-4" />
          Create Time Slots
        </Button>
      </div>

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-950 rounded-lg w-10 h-10">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Available Slots</p>
                <p className="font-bold text-2xl">{availableSlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-950 rounded-lg w-10 h-10">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Booked</p>
                <p className="font-bold text-2xl">{bookedSlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-950 rounded-lg w-10 h-10">
                <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Upcoming</p>
                <p className="font-bold text-2xl">{upcomingMeetings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upcoming Meetings</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent/Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No upcoming meetings</TableCell>
                </TableRow>
              ) : (
                upcomingMeetings.map((meeting: any) => {
                  const status = meeting.status ?? "available";
                  const statusConfig = MEETING_STATUS_CONFIG[status as keyof typeof MEETING_STATUS_CONFIG] ?? MEETING_STATUS_CONFIG.available;
                  const startTime = meeting.startTime ?? meeting.date;
                  const endTime = meeting.endTime;
                  const durationMins = startTime && endTime
                    ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
                    : meeting.duration ?? "—";
                  return (
                    <TableRow key={meeting.id} data-testid={`meeting-${meeting.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{format(new Date(startTime), "dd MMM yyyy")}</p>
                            <p className="text-muted-foreground text-xs">
                              {format(new Date(startTime), "HH:mm")}
                              {endTime ? ` - ${format(new Date(endTime), "HH:mm")}` : ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{durationMins} min</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          {meeting.type === "virtual" || meeting.meetingLink ? (
                            <><Video className="w-3.5 h-3.5" /> Virtual</>
                          ) : (
                            <><MapPin className="w-3.5 h-3.5" /> In-Person</>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {meeting.status === "booked" ? (
                          <div>
                            <p className="font-medium text-sm">{meeting.parentName ?? "—"}</p>
                            <p className="text-muted-foreground text-xs">{meeting.studentName ?? ""}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", statusConfig.color)}>{statusConfig.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Create Time Slots</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            data-testid="cancel-meeting-btn"
          >
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Meeting Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        className="border rounded-md"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="gap-4 grid grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="time"
                            data-testid="start-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="duration-selector">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maxSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Slots</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          max="10"
                          placeholder="e.g., 5"
                          data-testid="max-slots"
                        />
                      </FormControl>
                      <FormDescription>
                        How many consecutive time slots to create
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="in-person" id="in-person" />
                            <label
                              htmlFor="in-person"
                              className="flex items-center gap-2 font-normal text-sm cursor-pointer"
                            >
                              <MapPin className="w-4 h-4" />
                              In-Person
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="virtual" id="virtual" />
                            <label
                              htmlFor="virtual"
                              className="flex items-center gap-2 font-normal text-sm cursor-pointer"
                            >
                              <Video className="w-4 h-4" />
                              Virtual
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {meetingType === "in-person" && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Classroom 5A"
                            data-testid="location-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {meetingType === "virtual" && (
                  <FormField
                    control={form.control}
                    name="meetingLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Link (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., https://meet.google.com/..."
                            data-testid="meeting-link-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Leave empty to generate automatically
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              data-testid="create-slots-btn"
            >
              <Plus className="mr-2 w-4 h-4" />
              Create Time Slots
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">Parent-Teacher Meetings</h3>
          <p className="text-muted-foreground text-sm">
            Manage meeting schedules and availability
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          data-testid="create-slots-btn"
        >
          <Plus className="mr-2 w-4 h-4" />
          Create Time Slots
        </Button>
      </div>

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-950 rounded-lg w-10 h-10">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Available Slots</p>
                <p className="font-bold text-2xl">{availableSlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-950 rounded-lg w-10 h-10">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Booked</p>
                <p className="font-bold text-2xl">{bookedSlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-950 rounded-lg w-10 h-10">
                <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Upcoming</p>
                <p className="font-bold text-2xl">{upcomingMeetings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upcoming Meetings</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent/Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No upcoming meetings
                  </TableCell>
                </TableRow>
              ) : (
                upcomingMeetings.map((meeting) => {
                  const statusConfig = MEETING_STATUS_CONFIG[meeting.status];
                  return (
                    <TableRow
                      key={meeting.id}
                      data-testid={`meeting-${meeting.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {format(new Date(meeting.date), "dd MMM yyyy")}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {meeting.startTime} - {meeting.endTime}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {meeting.duration} min
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          {meeting.type === "virtual" ? (
                            <>
                              <Video className="w-3.5 h-3.5" />
                              Virtual
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5" />
                              In-Person
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {meeting.status === "booked" ? (
                          <div>
                            <p className="font-medium text-sm">
                              {meeting.parentName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {meeting.studentName} ({meeting.studentRoll})
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", statusConfig.color)}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CommunicationPage() {
  return (
    <div className="space-y-6 mx-auto p-6 max-w-6xl font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Communication</h1>
        <p className="text-muted-foreground text-sm">
          Send announcements, message parents, and schedule meetings
        </p>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="announcements" data-testid="announcements-tab">
            <Bell className="mr-2 w-4 h-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="messages" data-testid="messages-tab">
            <MessageSquare className="mr-2 w-4 h-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="meetings" data-testid="meetings-tab">
            <Calendar className="mr-2 w-4 h-4" />
            Meetings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementsTab />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          <MeetingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
