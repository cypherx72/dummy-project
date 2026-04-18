"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ImFileEmpty } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "@/context/session-context";
import { events, chartConfig, chartData } from "./_data/dashboard-data";

export default function DashboardPage() {
  const { user } = useSession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-row gap-2 bg-neutral-950 p-2 rounded-md w-full h-full">
        <section className="flex flex-col gap-3.5 bg-neutral-900 shadow-inner p-3 rounded-md w-3/5 h-full">
          {/* upcoming events */}
          <div className="flex flex-row items-start bg-neutral-800 shadow-xl p-2 rounded-md ring-[1.5px] ring-white/20 w-full h-2/5">
            <Tabs
              defaultValue="workshops"
              className="flex flex-col items-start w-full h-full"
            >
              <TabsList className="flex flex-row justify-between items-center w-full">
                <h3 className="font-sans font-semibold text-white/90 text-xl tracking-wide">
                  Upcoming Events
                </h3>
                <span>
                  <TabsTrigger value="workshops">Workshops</TabsTrigger>
                  <TabsTrigger value="webinar">Webinar</TabsTrigger>
                  <TabsTrigger value="cultural">Cultural</TabsTrigger>
                </span>
              </TabsList>

              {(["workshops", "cultural"] as const).map((tab) => (
                <TabsContent
                  key={tab}
                  value={tab}
                  className="gap-2 grid grid-flow-col w-full h-full overflow-x-auto auto-cols-[16rem] no-scrollbar"
                >
                  {events
                    .filter((e) => e.type === tab)
                    .map((event) => (
                      <HoverCard key={event.id} openDelay={10} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <Card className="relative gap-1 p-0 pb-3 rounded-md w-full max-w-sm h-full">
                            <div className="relative inset-0 rounded-md h-30 aspect-video">
                              <Image
                                src={event.image}
                                alt="Event cover"
                                fill
                                className="z-20 absolute brightness-60 dark:brightness-40 rounded-md rounded-b-none w-full object-cover aspect-video"
                              />
                            </div>
                            <CardHeader className="gap-1 px-2 font-sans text-sm tracking-wide">
                              <p className="font-extralight text-amber-500 text-xs">
                                {event.date}
                              </p>
                              <CardTitle className="font-medium truncate">
                                {event.title}
                              </CardTitle>
                              <p className="text-white/80 text-xs">
                                {event.location}
                              </p>
                            </CardHeader>
                          </Card>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="bottom"
                          className="flex flex-col gap-0.5 w-64"
                        >
                          <div className="font-semibold">
                            {event.organizer.handle}
                          </div>
                          <div>{event.organizer.description}</div>
                          <div className="mt-1 text-muted-foreground text-xs">
                            Since {event.organizer.joined}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                </TabsContent>
              ))}

              <TabsContent
                value="webinar"
                className="gap-2 grid grid-cols-4 w-full h-full overflow-x-auto no-scrollbar"
              >
                <Empty className="border border-dashed">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ImFileEmpty />
                    </EmptyMedia>
                    <EmptyTitle>No Webinars</EmptyTitle>
                    <EmptyDescription>
                      No webinar meetings available right now.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="outline" size="sm">
                      Schedule One
                    </Button>
                  </EmptyContent>
                </Empty>
              </TabsContent>
            </Tabs>
          </div>

          {/* Performance Metrics */}
          <div className="flex flex-row items-start bg-neutral-800 shadow-xl p-2 rounded-md ring-[1.5px] ring-white/20 w-full h-3/5">
            <Tabs
              defaultValue="academic"
              className="flex flex-col items-start w-full h-full"
            >
              <TabsList className="flex flex-row justify-between items-center w-full">
                <h3 className="font-sans font-semibold text-white/90 text-xl tracking-wide">
                  Performance Metrics
                </h3>
                <span>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </span>
              </TabsList>

              <TabsContent
                value="academic"
                className="flex flex-col gap-2 w-full h-full"
              >
                <span className="flex flex-row justify-between items-start">
                  <Select>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue
                        defaultValue="subject-wise-scores"
                        placeholder="Select a key metric"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Academic</SelectLabel>
                        <SelectItem value="gpa">GPA</SelectItem>
                        <SelectItem value="performance-over-time">
                          Performance Over Time
                        </SelectItem>
                        <SelectItem value="subject-wise-scores">
                          Subject-wise Scores
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </span>

                <Card className="gap-3 py-3 w-full h-full">
                  <CardHeader>
                    <CardTitle>Subject-wise Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="w-4/5 max-h-[170px]"
                    >
                      <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 0 }}
                      >
                        <YAxis
                          dataKey="browser"
                          type="category"
                          tickLine={false}
                          tickMargin={5}
                          axisLine={false}
                          tickFormatter={(value) =>
                            chartConfig[value as keyof typeof chartConfig]
                              ?.label
                          }
                        />
                        <XAxis dataKey="visitors" type="number" hide />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="visitors" layout="vertical" radius={5} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                      Trending up by 5.2% this month{" "}
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-muted-foreground leading-none">
                      Showing subject scores for the current semester
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="w-full">
                <Empty className="border border-dashed mt-4">
                  <EmptyHeader>
                    <EmptyTitle>Attendance Data</EmptyTitle>
                    <EmptyDescription>
                      View attendance from the Attendance page.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/assignments/@student/attendance">
                        Go to Attendance
                      </a>
                    </Button>
                  </EmptyContent>
                </Empty>
              </TabsContent>

              <TabsContent value="engagement" className="w-full">
                <Empty className="border border-dashed mt-4">
                  <EmptyHeader>
                    <EmptyTitle>Engagement Metrics</EmptyTitle>
                    <EmptyDescription>
                      Coming soon — tracks participation and activity.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="flex flex-col gap-3.5 bg-neutral-900 shadow-inner p-3 rounded-md w-2/5 h-full">
          {/* Today's schedule placeholder */}
          <div className="flex flex-col justify-start bg-neutral-800 shadow-xl p-4 rounded-md ring-[1.5px] ring-white/20 w-full h-1/3">
            <h3 className="mb-3 font-sans font-semibold text-white/90 text-base tracking-wide">
              Today&apos;s Schedule
            </h3>
            <p className="text-muted-foreground text-sm">
              {user?.role === "teacher"
                ? "Check your class timetable for today's sessions."
                : "View your enrolled class schedule."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-fit"
              asChild
            >
              <a
                href={
                  user?.role === "teacher"
                    ? "/assignments/@teacher/class-schedule"
                    : "/assignments/@student/class-schedule"
                }
              >
                View Schedule
              </a>
            </Button>
          </div>

          {/* High priority assignments */}
          <div className="flex flex-col justify-start bg-neutral-800 shadow-xl p-4 rounded-md ring-[1.5px] ring-white/20 w-full h-1/3">
            <h3 className="mb-3 font-sans font-semibold text-white/90 text-base tracking-wide">
              {user?.role === "teacher"
                ? "Assignment Overview"
                : "Pending Assignments"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {user?.role === "teacher"
                ? "Create and manage assignments from the Assignments page."
                : "View your pending assignments and upcoming deadlines."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-fit"
              asChild
            >
              <a href="/assignments">Go to Assignments</a>
            </Button>
          </div>

          {/* Calendar / quick info */}
          <div className="flex flex-col justify-start bg-neutral-800 shadow-xl p-4 rounded-md ring-[1.5px] ring-white/20 w-full h-1/3">
            <h3 className="mb-3 font-sans font-semibold text-white/90 text-base tracking-wide">
              Progress & Reports
            </h3>
            <p className="text-muted-foreground text-sm">
              {user?.role === "teacher"
                ? "Review student progress reports and add remarks."
                : "Track your academic progress and view your report."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-fit"
              asChild
            >
              <a href="/dashboard/progress-report">View Report</a>
            </Button>
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
