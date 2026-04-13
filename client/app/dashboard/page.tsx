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
  type ChartConfig,
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

export default function DashboardPage() {
  const data = useSession();
  // data loaded
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-row gap-2 bg-neutral-950 p-2 rounded-md w-full h-full">
        <section className="flex flex-col gap-3.5 bg-neutral-900 shadow-inner p-3 rounded-md w-3/5 h-full">
          {/*upcoming events */}
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
              <TabsContent
                value="workshops"
                className="gap-2 grid grid-flow-col w-full h-full overflow-x-auto auto-cols[16rem] no-scrollbar"
              >
                {events.map((event) => (
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
                            Al Auditorium C
                          </p>
                        </CardHeader>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="bottom"
                      className="flex flex-col gap-0.5 w-64"
                    >
                      <div className="font-semibold">@nextjs</div>
                      <div>
                        The React Framework – created and maintained by @vercel.
                      </div>
                      <div className="mt-1 text-muted-foreground text-xs">
                        Joined December 2021
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </TabsContent>{" "}
              <TabsContent
                value="cultural"
                className="gap-2 grid grid-flow-col w-full h-full overflow-x-auto au no-scrollbar"
              >
                {events.map((event) => (
                  <HoverCard key={event.id} openDelay={10} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Card className="relative gap-1 p-0 rounded-md w-full max-w-sm h-full">
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
                            Al Auditorium C
                          </p>
                        </CardHeader>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="bottom"
                      className="flex flex-col gap-0.5 w-64"
                    >
                      <div className="font-semibold">@nextjs</div>
                      <div>
                        The React Framework – created and maintained by @vercel.
                      </div>
                      <div className="mt-1 text-muted-foreground text-xs">
                        Joined December 2021
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </TabsContent>
              {/*Empty content */}
              <TabsContent
                value="webinar"
                className="gap-2 grid grid-cols-4 w-full h-full overflow-x-auto no-scrollbar"
              >
                <Empty className="border border-dashed">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ImFileEmpty />
                    </EmptyMedia>
                    <EmptyTitle>Cloud Storage Empty</EmptyTitle>
                    <EmptyDescription>
                      No Webinar Meetings available.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="outline" size="sm">
                      Upload Files
                    </Button>
                  </EmptyContent>
                </Empty>
              </TabsContent>
            </Tabs>
          </div>
          {/*chart Information */}
          <div className="flex flex-row items-start bg-neutral-800 shadow-xl p-2 rounded-md ring-[1.5px] ring-white/20 w-full h-3/5">
            <Tabs
              defaultValue="academic"
              className="flex flex-col items-start w-full h-full"
            >
              <TabsList className="flex flex-row justify-between items-center w-full">
                <h3 className="font-sans font-semibold text-white/90 text-xl tracking-wide">
                  Peformance Metrics
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
                  {/* <p className="w-1/2 font-sans font-medium text-sm tracking-wide">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsam, maiores nulla sapiente non tenetur tempore itaque,
                  </p> */}
                  <Select>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue
                        defaultValue="gpa"
                        placeholder="Select a key metric"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Academic</SelectLabel>
                        <SelectItem value="gpa">GPA</SelectItem>
                        <SelectItem value="perfomance-over-time">
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
                        margin={{
                          left: 0,
                        }}
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
                      Showing total visitors for the last 6 months
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>{" "}
            </Tabs>
          </div>
        </section>

        <section className="flex flex-col gap-3.5 bg-neutral-900 shadow-inner p-3 rounded-md w-3/5 h-full">
          {/*today schedule*/}
          <div className="flex flex-row items-start bg-neutral-800 shadow-xl p-2 rounded-md ring-[1.5px] ring-white/20 w-full h-1/3"></div>
          {/*high priority assignemnts */}
          <div className="flex flex-row items-start bg-neutral-800 shadow-xl p-2 rounded-md ring-[1.5px] ring-white/20 w-full h-1/3"></div>
          {/*calendar */}
          <div className="flex flex-row items-start bg-neutral-800 shadow-xl p-2 rounded-md ring-[1.5px] ring-white/20 w-full h-1/3">
            {/* <Calendar mode="single" className="border rounded-lg"  /> */}
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const events = [
  {
    id: "evt-1",
    type: "workshops", // matches TabsTrigger value
    title: "Design Systems Meetup",
    date: "2025-07-15",
    location: "AI Auditorium C",
    image:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: {
      handle: "@nextjs",
      description: "The React Framework – created and maintained by @vercel.",
      joined: "December 2021",
    },
  },
  {
    id: "evt-2",
    type: "workshops",
    title: "Advanced React Patterns",
    date: "2025-07-22",
    location: "Tech Hall B",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: {
      handle: "@reactjs",
      description: "A JavaScript library for building user interfaces.",
      joined: "May 2013",
    },
  },
  {
    id: "evt-3",
    type: "webinar",
    title: "Scaling Next.js Apps",
    date: "2025-08-01",
    location: "Online Webinar",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: {
      handle: "@vercel",
      description: "Develop. Preview. Ship.",
      joined: "April 2020",
    },
  },
  {
    id: "evt-4",
    type: "cultural",
    title: "Annual Cultural Fest",
    date: "2025-08-10",
    location: "Open Grounds",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: {
      handle: "@campuslife",
      description: "Celebrating diversity and creativity.",
      joined: "January 2019",
    },
  },
  {
    id: "evt-5",
    type: "cultural",
    title: "Annual Cultural Fest",
    date: "2025-08-10",
    location: "Open Grounds",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: {
      handle: "@campuslife",
      description: "Celebrating diversity and creativity.",
      joined: "January 2019",
    },
  },
  {
    id: "evt-6",
    type: "cultural",
    title: "Annual Cultural Fest",
    date: "2025-08-10",
    location: "Open Grounds",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: {
      handle: "@campuslife",
      description: "Celebrating diversity and creativity.",
      joined: "January 2019",
    },
  },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];
