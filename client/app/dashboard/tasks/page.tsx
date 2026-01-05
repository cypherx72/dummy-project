"use client";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { PiDotsNineBold } from "react-icons/pi";
import { FaTasks } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaBorderAll } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { formatDate } from "@/lib/general-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaSortAmountUp } from "react-icons/fa";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { PiCaretUpDownBold } from "react-icons/pi";

import { IoFilter } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";

type assignmentType = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string | null;
  course: {
    courseName: string;
    courseCode: string;
  };
  status: string;
  mark: number;
  priority: "high" | "medium" | "low";
  tasks: {
    mark: number;
    status: "pending" | "cancelled" | "NULL" | "completed";
  };
};

const socket = io("http://localhost:5000");

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function AssignmentTable() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const router = useRouter();
  const [assignments, setAssignments] = useState<assignmentType[]>([]);
  const [sortStates, setSortStates] = useState<
    Record<number, "default" | "ascending" | "descending">
  >({});
  const [position, setPosition] = React.useState("bottom");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const columns = [
    {
      name: "Task ID",
      sort: true,
      id: 1,
    },
    {
      name: "Task",
      sort: false,
      id: 2,
    },
    {
      name: "Status",
      sort: false,
      id: 3,
    },
    {
      name: "Priority",
      sort: false,
      id: 4,
    },
    {
      name: "Mark",
      sort: true,
      id: 5,
    },
    {
      name: "Assigned On",
      sort: true,
      id: 6,
    },
    {
      name: "Deadline",
      sort: true,
      id: 7,
    },
    {
      name: "Action",
      sort: false,
      id: 8,
    },
  ];

  useEffect(() => {
    socket.on("assignmentUpdate", (updatedAssignments: assignmentType) => {
      // Assuming your server sends an array of assignments on 'assignmentUpdate'
      setAssignments((prevAssignments) => [
        ...prevAssignments,
        updatedAssignments,
      ]);
    });

    // Cleanup function: important to remove the listener when the component unmounts
    return () => {
      socket.off("assignmentUpdate");
    };
  }, []);

  console.log("Received assignments: ", assignments);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            query FetchAssignments($userId: String!) {
              fetchAssignments(userId: $userId) {
                id
                title
                description
                createdAt
                dueDate
                course { 
                courseName
                courseCode
                }
                tasks {
                  status
                  mark
                }
              }
            }
          `,
            variables: {
              userId: "1",
            },
          }),
        });

        const data = await response.json();
        setAssignments(data.data.fetchAssignments);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  function filterBy(filter: string) {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((assignment) => assignment.tasks.status !== filter)
    );
  }

  function sortBy(field: keyof assignmentType, order: "asc" | "desc") {
    setAssignments((prev) => {
      const sorted = [...prev].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];

        // Handle nested fields like tasks.status
        if (field === "status") {
          aVal = a.tasks?.status || "";
          bVal = b.tasks?.status || "";
        } else if (field === "mark") {
          aVal = a.tasks?.mark ?? -Infinity;
          bVal = b.tasks?.mark ?? -Infinity;
        }

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === "string" && typeof bVal === "string") {
          return order === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return order === "asc"
          ? (aVal as number) > (bVal as number)
            ? 1
            : -1
          : (aVal as number) < (bVal as number)
          ? 1
          : -1;
      });

      return sorted;
    });
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // send a request to database to search for a task
  }
  const submitValue = form.watch("username");

  function toggleSort(id: number) {
    setSortStates((prev) => {
      const current = prev[id] || "default";
      const next =
        current === "default"
          ? "ascending"
          : current === "ascending"
          ? "descending"
          : "default";

      // Map column id → actual field
      const fieldMap: Record<number, keyof assignmentType> = {
        1: "id",
        5: "mark",
        6: "createdAt",
        7: "dueDate",
      };

      if (fieldMap[id]) {
        if (next === "ascending") sortBy(fieldMap[id], "asc");
        else if (next === "descending") sortBy(fieldMap[id], "desc");
      }

      return { ...prev, [id]: next };
    });
  }

  const SortButton = ({ id }: { id: number }) => (
    <Button
      variant="link"
      className="no-underline"
      onClick={() => toggleSort(id)}
    >
      {sortStates[id] === "ascending" ? (
        <FaSortAmountUpAlt />
      ) : sortStates[id] === "descending" ? (
        <FaSortAmountUp />
      ) : (
        <PiCaretUpDownBold />
      )}
    </Button>
  );

  console.log("Assignments: ", assignments);

  const filteredAssignments = useMemo(() => {
    if (selectedCourse === "all") return assignments;
    return assignments.filter((a) => a.course.courseName === selectedCourse);
  }, [assignments, selectedCourse]);

  return (
    <section className="flex flex-col m-auto">
      <header className="flex flex-col m-auto my-12">
        <div>
          <Select
            name="courses"
            onValueChange={(course) => setSelectedCourse(course)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Courses</SelectLabel>
                <SelectItem value="Computer Science">
                  Computer Science
                </SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="English">English</SelectItem>

                <SelectItem value="data structures">Data Structures</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start my-12">
          <span className="flex flex-row items-center gap-x-2">
            <FaTasks className="text-neutral-400" />{" "}
            <h1 className="font-bold text-2xl">Tasks</h1>
          </span>
          <p className="w-1/2 text-neutral-300 text-wrap">
            Stay on top of your work. All tasks are automatically updated based
            on their due dates and priorities, so you always know what matters
            most. Use the sorting and filters to organize by deadline, priority,
            or status.
          </p>
        </div>

        <div className="flex flex-row items-start">
          <div className="flex flex-row items-start gap-x-8 w-1/2">
            <Button>
              <FaBorderAll />
              See All
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <IoFilter />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter By: </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioItem value="high">
                          High
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="medium">
                          Medium
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="low">
                          Low
                        </DropdownMenuRadioItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioItem value="pending">
                          Pending
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="completed">
                          Completed
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="null">
                          Null
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="cancelled">
                          Cancelled
                        </DropdownMenuRadioItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-row justify-evenly items-start gap-x-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-center gap-0">
                    <FormControl>
                      <div className="relative">
                        {!submitValue && (
                          <FaSearch className="top-2.5 left-4 absolute text-neutral-500" />
                        )}
                        <Input placeholder="      Search" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </header>

      {filteredAssignments.length > 0 ? (
        <Table>
          <TableHeader className="py-8 border-1 border-neutral-900 border-t-1">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={`${
                    column.name === "Task" ? "w-[25vw] " : ""
                  } text-center bg-neutral-950`}
                >
                  {column.name}
                  {column.sort && <SortButton id={column.id} />}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="border-1 border-neutral-800">
            {filteredAssignments.map((assignemnt) => (
              <TableRow
                key={assignemnt.id}
                className="hover:bg-neutral-700 even:bg-neutral-900 odd:bg-neutral-800 text-center"
              >
                <TableCell>{assignemnt.id}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex items-center"
                  >
                    <AccordionItem
                      value="item-1"
                      className="flex flex-col items-center"
                    >
                      <AccordionTrigger className="font-semibold text-sm text-center">
                        {assignemnt.title}
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 text-sm text-left text-wrap">
                        {assignemnt.description}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`
                  ${
                    assignemnt.tasks
                      ? assignemnt.tasks.status === "completed"
                        ? "bg-green-500"
                        : assignemnt.tasks.status === "cancelled"
                        ? "bg-red-500"
                        : assignemnt.tasks.status === "pending"
                        ? "bg-amber-500"
                        : ""
                      : "bg-gray-700"
                  }  font-bold text-[10px]
                  `}
                  >
                    {assignemnt.tasks ? assignemnt.tasks.status : "null"}
                  </Badge>
                </TableCell>{" "}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`
                  ${
                    assignemnt.tasks
                      ? assignemnt.tasks.status === "completed"
                        ? "bg-green-500"
                        : assignemnt.tasks.status === "cancelled"
                        ? "bg-red-500"
                        : assignemnt.tasks.status === "pending"
                        ? "bg-amber-500"
                        : ""
                      : "bg-gray-700"
                  }  font-bold text-[10px]
                  `}
                  >
                    {assignemnt.tasks ? assignemnt.tasks.status : "null"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {assignemnt.tasks ? assignemnt.tasks.mark || "??" : "--"}
                </TableCell>
                <TableCell>{formatDate(assignemnt.dueDate)}</TableCell>
                <TableCell>{formatDate(assignemnt.dueDate)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <PiDotsNineBold size={12} />{" "}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`tasks/upload/${assignemnt.id}`)
                        }
                      >
                        Upload
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="m-auto font-bold text-neutral-500 text-3xl">
          No assignments available.
        </p>
      )}
    </section>
  );
}
