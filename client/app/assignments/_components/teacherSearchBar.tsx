"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState, useRef } from "react";
import { useAssignmentUI } from "@/context/tasks/task-context";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TeacherSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { debouncedSearch, searchAssignmentsData, searchAssignmentsLoading } =
    useAssignmentUI();

  const results: any[] =
    searchAssignmentsData?.SearchAssignments?.assignments ?? [];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      (debouncedSearch as (q: string) => void)(val);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function handleClear() {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Field orientation="horizontal" className="relative w-md">
          <Input
            ref={inputRef}
            type="search"
            className="p-5 font-sans font-medium text-lg tracking-wide"
            placeholder="Search for assignments"
            value={query}
            onChange={handleChange}
            onFocus={() => query.trim() && setOpen(true)}
          />
          {query ? (
            <Button
              onClick={handleClear}
              className="right-5 z-10 absolute text-zinc-400 hover:text-zinc-200"
              type="button"
            >
              <X className="size-5" />
            </Button>
          ) : (
            <Search className="right-5 z-10 absolute size-5 text-zinc-400 pointer-events-none" />
          )}
        </Field>
      </PopoverAnchor>

      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            {searchAssignmentsLoading && (
              <CommandEmpty>Searching…</CommandEmpty>
            )}
            {!searchAssignmentsLoading && results.length === 0 && (
              <CommandEmpty>No results for &quot;{query}&quot;.</CommandEmpty>
            )}
            {!searchAssignmentsLoading && results.length > 0 && (
              <CommandGroup heading="Assignments">
                {results.map((a) => (
                  <CommandItem
                    key={a.id}
                    onSelect={() => {
                      setOpen(false);
                      router.push(
                        "/assignments/@teacher/assignments-and-quizzes",
                      );
                    }}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <span className="font-medium text-sm">{a.title}</span>
                    <span className="text-muted-foreground text-xs">
                      {a.course?.name ?? "—"}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
