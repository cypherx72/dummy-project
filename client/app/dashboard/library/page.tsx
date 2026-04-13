"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  BookMarked,
  RotateCcw,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Flame,
  Sparkles,
  GraduationCap,
  FlaskConical,
  Palette,
  Globe,
  Music,
  Cpu,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { showToast, errorToast } from "@/components/ui/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  cover: string; // gradient CSS string
  rating: number;
  totalCopies: number;
  availableCopies: number;
  pages: number;
  year: number;
  description: string;
  isBorrowed?: boolean;
  dueDate?: string;
  isReserved?: boolean;
  isNew?: boolean;
}

interface SubjectCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

interface PopularAuthor {
  id: string;
  name: string;
  books: number;
  initials: string;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CURRENTLY_READING: Book[] = [
  {
    id: "b1",
    title: "Discrete Mathematics",
    author: "Kenneth Rosen",
    subject: "Mathematics",
    cover: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    rating: 4.3,
    totalCopies: 8,
    availableCopies: 0,
    pages: 544,
    year: 2018,
    description:
      "A comprehensive introduction to discrete mathematics and its applications to computer science.",
    isBorrowed: true,
    dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
  },
  {
    id: "b2",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    subject: "English",
    cover: "linear-gradient(135deg, #f5e642 0%, #e8a317 50%, #c0392b 100%)",
    rating: 4.1,
    totalCopies: 12,
    availableCopies: 0,
    pages: 180,
    year: 1925,
    description:
      "A story of wealth, love, and the American dream set in the roaring twenties.",
    isBorrowed: true,
    dueDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
  },
];

const MOCK_POPULAR: Book[] = [
  {
    id: "b3",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    subject: "History",
    cover: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
    rating: 4.8,
    totalCopies: 6,
    availableCopies: 2,
    pages: 443,
    year: 2011,
    description:
      "A brief history of humankind from the Stone Age to the modern era.",
  },
  {
    id: "b4",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    subject: "Psychology",
    cover: "linear-gradient(135deg, #0652DD 0%, #1289A7 100%)",
    rating: 4.6,
    totalCopies: 5,
    availableCopies: 1,
    pages: 499,
    year: 2011,
    description:
      "An exploration of the two systems that drive the way we think.",
  },
  {
    id: "b5",
    title: "Atomic Habits",
    author: "James Clear",
    subject: "Self-Help",
    cover: "linear-gradient(135deg, #f9ca24 0%, #f0932b 100%)",
    rating: 4.9,
    totalCopies: 8,
    availableCopies: 3,
    pages: 320,
    year: 2018,
    description:
      "An easy and proven way to build good habits and break bad ones.",
  },
  {
    id: "b6",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    subject: "Science",
    cover: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
    rating: 4.5,
    totalCopies: 4,
    availableCopies: 0,
    pages: 212,
    year: 1988,
    description:
      "A landmark volume in science writing by one of the great minds of our time.",
  },
  {
    id: "b7",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    subject: "Technology",
    cover: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 2,
    pages: 352,
    year: 2019,
    description: "Your journey to mastery in software development.",
    isNew: true,
  },
  {
    id: "b8",
    title: "1984",
    author: "George Orwell",
    subject: "Fiction",
    cover: "linear-gradient(135deg, #d63031 0%, #e17055 100%)",
    rating: 4.7,
    totalCopies: 10,
    availableCopies: 4,
    pages: 328,
    year: 1949,
    description:
      "A dystopian social science fiction novel and cautionary tale.",
  },
];

const MOCK_NEW: Book[] = [
  {
    id: "b9",
    title: "The Art of War",
    author: "Sun Tzu",
    subject: "Philosophy",
    cover: "linear-gradient(135deg, #2d3436 0%, #b2bec3 100%)",
    rating: 4.4,
    totalCopies: 6,
    availableCopies: 4,
    pages: 273,
    year: 2023,
    description:
      "Ancient Chinese military treatise adapted for modern strategy.",
    isNew: true,
  },
  {
    id: "b10",
    title: "Clean Code",
    author: "Robert C. Martin",
    subject: "Technology",
    cover: "linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)",
    rating: 4.6,
    totalCopies: 4,
    availableCopies: 2,
    pages: 431,
    year: 2023,
    description: "A handbook of agile software craftsmanship.",
    isNew: true,
  },
  {
    id: "b11",
    title: "The Alchemist",
    author: "Paulo Coelho",
    subject: "Fiction",
    cover: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
    rating: 4.5,
    totalCopies: 9,
    availableCopies: 5,
    pages: 197,
    year: 2023,
    description: "A magical story about following your dreams.",
    isNew: true,
  },
  {
    id: "b12",
    title: "Cosmos",
    author: "Carl Sagan",
    subject: "Science",
    cover: "linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%)",
    rating: 4.8,
    totalCopies: 3,
    availableCopies: 1,
    pages: 365,
    year: 2023,
    description: "A personal voyage through the universe.",
    isNew: true,
  },
  {
    id: "b13",
    title: "Zero to One",
    author: "Peter Thiel",
    subject: "Business",
    cover: "linear-gradient(135deg, #00b894 0%, #55efc4 100%)",
    rating: 4.4,
    totalCopies: 5,
    availableCopies: 3,
    pages: 224,
    year: 2023,
    description: "Notes on startups, or how to build the future.",
    isNew: true,
  },
];

const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    id: "sci",
    label: "Science",
    icon: <FlaskConical className="w-5 h-5" />,
    count: 1240,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "arts",
    label: "Arts",
    icon: <Palette className="w-5 h-5" />,
    count: 1820,
    color:
      "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  },
  {
    id: "hist",
    label: "History",
    icon: <Globe className="w-5 h-5" />,
    count: 640,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  {
    id: "tech",
    label: "Technology",
    icon: <Cpu className="w-5 h-5" />,
    count: 910,
    color:
      "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  },
  {
    id: "lit",
    label: "Literature",
    icon: <BookOpen className="w-5 h-5" />,
    count: 2100,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  },
  {
    id: "mus",
    label: "Music",
    icon: <Music className="w-5 h-5" />,
    count: 380,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
];

const POPULAR_AUTHORS: PopularAuthor[] = [
  {
    id: "a1",
    name: "Yuval Harari",
    books: 4,
    initials: "YH",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  {
    id: "a2",
    name: "James Clear",
    books: 2,
    initials: "JC",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    id: "a3",
    name: "Carl Sagan",
    books: 6,
    initials: "CS",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  {
    id: "a4",
    name: "George Orwell",
    books: 8,
    initials: "GO",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  {
    id: "a5",
    name: "Stephen Hawking",
    books: 5,
    initials: "SH",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    id: "a6",
    name: "Paulo Coelho",
    books: 11,
    initials: "PC",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string) {
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000,
  );
  return diff;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-500">
      <Star className="fill-current w-3 h-3" />
      <span className="font-medium text-xs">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Book Cover ───────────────────────────────────────────────────────────────

function BookCover({
  book,
  className,
  onClick,
}: {
  book: Book;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col flex-shrink-0 justify-end shadow-md hover:shadow-xl p-2.5 rounded-lg overflow-hidden hover:scale-105 active:scale-100 transition-all duration-200 cursor-pointer",
        className,
      )}
      style={{ background: book.cover }}
    >
      {book.isNew && (
        <span className="top-2 right-2 absolute bg-primary px-1.5 py-0.5 rounded-full font-bold text-[9px] text-primary-foreground uppercase tracking-wide">
          New
        </span>
      )}
      <div className="bg-black/50 backdrop-blur-sm px-2 py-1.5 rounded-md">
        <p className="font-bold text-[11px] text-white line-clamp-2 leading-tight">
          {book.title}
        </p>
        <p className="mt-0.5 text-[9px] text-white/60 truncate">
          {book.author}
        </p>
      </div>
    </div>
  );
}

// ─── Book Detail Dialog ───────────────────────────────────────────────────────

function BookDetailDialog({
  book,
  onClose,
}: {
  book: Book | null;
  onClose: () => void;
}) {
  const [borrowing, setBorrowing] = React.useState(false);
  const [reserving, setReserving] = React.useState(false);

  if (!book) return null;

  const available = book.availableCopies > 0;
  const pctAvail = Math.round((book.availableCopies / book.totalCopies) * 100);

  async function handleBorrow() {
    setBorrowing(true);
    await new Promise((r) => setTimeout(r, 800));
    setBorrowing(false);
    toast.success("Book borrowed!", {
      description: `Due in 14 days · ${book.title}`,
    });
    onClose();
  }

  async function handleReserve() {
    setReserving(true);
    await new Promise((r) => setTimeout(r, 700));
    setReserving(false);
    toast.success("Reserved!", {
      description: `You'll be notified when ${book.title} is available`,
    });
    onClose();
  }

  return (
    <Dialog open={!!book} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex gap-4">
          {/* Mini cover */}
          <div
            className="flex-shrink-0 shadow-md rounded-lg w-20 h-28"
            style={{ background: book.cover }}
          />
          <div className="flex-1 pt-1 min-w-0">
            <DialogHeader>
              <DialogTitle className="text-base leading-snug">
                {book.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {book.author} · {book.year}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-3 mt-2 text-muted-foreground text-xs">
              <StarRating rating={book.rating} />
              <span>{book.pages} pages</span>
              <Badge variant="secondary" className="text-[10px]">
                {book.subject}
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm">{book.description}</p>

        {/* Availability */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Availability</span>
            <span
              className={cn(
                "font-semibold",
                available
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500",
              )}
            >
              {available
                ? `${book.availableCopies} of ${book.totalCopies} available`
                : "All copies borrowed"}
            </span>
          </div>
          <Progress value={pctAvail} className="h-1.5" />
        </div>

        {book.isBorrowed && book.dueDate && (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
              daysUntil(book.dueDate) <= 3
                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
            )}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            You have this book · Due{" "}
            {format(new Date(book.dueDate), "dd MMM yyyy")}
            {daysUntil(book.dueDate) <= 3 && " · Return soon!"}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {book.isBorrowed ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                showToast("Renewal requested", undefined, "info");
                onClose();
              }}
            >
              <RotateCcw className="mr-1.5 w-3.5 h-3.5" /> Renew
            </Button>
          ) : available ? (
            <Button size="sm" disabled={borrowing} onClick={handleBorrow}>
              <BookOpen className="mr-1.5 w-3.5 h-3.5" />
              {borrowing ? "Borrowing…" : "Borrow"}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              disabled={reserving}
              onClick={handleReserve}
            >
              <Bookmark className="mr-1.5 w-3.5 h-3.5" />
              {reserving ? "Reserving…" : "Reserve"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Horizontal Scroll Row ────────────────────────────────────────────────────

function ScrollRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    ref.current?.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  }

  return (
    <div className="group/scroll relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden top-1/2 left-0 z-10 absolute group-hover/scroll:flex justify-center items-center bg-background/90 hover:bg-muted shadow-md border rounded-full w-8 h-8 transition-all -translate-x-4 -translate-y-1/2"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div
        ref={ref}
        className={cn(
          "flex gap-3 pb-2 overflow-x-auto scrollbar-hide",
          className,
        )}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden top-1/2 right-0 z-10 absolute group-hover/scroll:flex justify-center items-center bg-background/90 hover:bg-muted shadow-md border rounded-full w-8 h-8 transition-all -translate-y-1/2 translate-x-4"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1 font-medium text-primary text-xs hover:underline"
        >
          {action}
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function StudentLibraryPage() {
  const [search, setSearch] = React.useState("");
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);

  const allBooks = [...MOCK_CURRENTLY_READING, ...MOCK_POPULAR, ...MOCK_NEW];
  const searchResults = search.trim()
    ? allBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase()) ||
          b.subject.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const dueSoon = MOCK_CURRENTLY_READING.filter(
    (b) => b.dueDate && daysUntil(b.dueDate) <= 5,
  );

  return (
    <div className="space-y-10 mx-auto px-6 py-6 max-w-6xl">
      {/* ── Hero search bar ──────────────────────────────────────────────────── */}
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Library</h1>
          <p className="mt-0.5 text-muted-foreground text-sm">
            Explore books, track your reading, and discover new titles.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder="Search books, authors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* ── Search results ───────────────────────────────────────────────────── */}
      {search.trim() && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
            for &ldquo;{search}&rdquo;
          </p>
          {searchResults.length > 0 ? (
            <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="flex items-center gap-3 bg-card hover:bg-muted/50 p-3 border rounded-xl transition-colors cursor-pointer"
                >
                  <div
                    className="flex-shrink-0 rounded-md w-10 h-14"
                    style={{ background: book.cover }}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {book.title}
                    </p>
                    <p className="text-muted-foreground text-xs truncate">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={book.rating} />
                      <span
                        className={cn(
                          "font-medium text-[10px]",
                          book.availableCopies > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500",
                        )}
                      >
                        {book.availableCopies > 0 ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center bg-muted/30 py-12 border border-dashed rounded-xl text-center">
              <BookOpen className="mb-3 w-10 h-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                No books found for &ldquo;{search}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {!search.trim() && (
        <>
          {/* ── Due soon alert ─────────────────────────────────────────────── */}
          {dueSoon.length > 0 && (
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 border border-amber-300 dark:border-amber-800 rounded-xl">
              <AlertCircle className="mt-0.5 w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  Return reminder —{" "}
                </span>
                <span className="text-amber-700 dark:text-amber-400">
                  {dueSoon.map((b) => (
                    <span key={b.id}>
                      <span className="font-medium">{b.title}</span> is due in{" "}
                      {daysUntil(b.dueDate!)} day
                      {daysUntil(b.dueDate!) !== 1 ? "s" : ""}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          )}

          {/* ── Stats ribbon ───────────────────────────────────────────────── */}
          <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
            {[
              {
                label: "Currently Reading",
                value: MOCK_CURRENTLY_READING.length,
                icon: <BookOpen className="w-4 h-4" />,
                color: "text-violet-600 dark:text-violet-400",
              },
              {
                label: "Books Borrowed",
                value: 14,
                icon: <BookMarked className="w-4 h-4" />,
                color: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Due This Week",
                value: dueSoon.length,
                icon: <Clock className="w-4 h-4" />,
                color:
                  dueSoon.length > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground",
              },
              {
                label: "Total in Library",
                value: "7.2K",
                icon: <TrendingUp className="w-4 h-4" />,
                color: "text-sky-600 dark:text-sky-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 bg-card p-4 border rounded-xl"
              >
                <div className={cn("bg-muted p-2 rounded-lg", stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                  <p className="font-bold text-xl leading-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Currently reading ──────────────────────────────────────────── */}
          {MOCK_CURRENTLY_READING.length > 0 && (
            <section>
              <SectionHeader
                icon={<BookMarked className="w-4 h-4" />}
                title="Currently Reading"
                action="My Loans"
              />
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                {MOCK_CURRENTLY_READING.map((book) => {
                  const days = daysUntil(book.dueDate!);
                  const isUrgent = days <= 3;
                  return (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className="group flex gap-4 bg-card hover:bg-muted/40 hover:shadow-md p-4 border rounded-xl transition-all duration-150 cursor-pointer"
                    >
                      <div
                        className="flex-shrink-0 shadow-sm group-hover:shadow-md rounded-lg w-16 h-22 transition-shadow"
                        style={{ background: book.cover, minHeight: "88px" }}
                      />
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <p className="font-semibold text-sm line-clamp-2 leading-snug">
                          {book.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {book.author}
                        </p>
                        <StarRating rating={book.rating} />
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 mt-1 px-2 py-1 rounded-md font-medium text-xs",
                            isUrgent
                              ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          Due in {days} day{days !== 1 ? "s" : ""} ·{" "}
                          {format(new Date(book.dueDate!), "dd MMM")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Subject categories ─────────────────────────────────────────── */}
          <section>
            <SectionHeader
              icon={<GraduationCap className="w-4 h-4" />}
              title="Browse by Subject"
              action="All Subjects"
            />
            <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {SUBJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={cn(
                    "flex flex-col items-start gap-2 hover:shadow-md px-4 py-3.5 border rounded-xl text-left hover:scale-[1.02] active:scale-100 transition-all",
                    cat.color,
                  )}
                >
                  {cat.icon}
                  <div>
                    <p className="font-semibold text-sm">{cat.label}</p>
                    <p className="opacity-70 text-[11px]">
                      {cat.count.toLocaleString()} books
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Popular books ──────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              icon={<Flame className="w-4 h-4" />}
              title="Popular Books"
              action="Show all"
            />
            <ScrollRow>
              {MOCK_POPULAR.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col flex-shrink-0 gap-2 w-[130px]"
                >
                  <BookCover
                    book={book}
                    className="w-[130px] h-[180px]"
                    onClick={() => setSelectedBook(book)}
                  />
                  <div>
                    <p className="font-semibold text-xs truncate">
                      {book.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {book.author}
                    </p>
                    <div className="flex justify-between items-center mt-0.5">
                      <StarRating rating={book.rating} />
                      <span
                        className={cn(
                          "font-medium text-[10px]",
                          book.availableCopies > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500",
                        )}
                      >
                        {book.availableCopies > 0
                          ? `${book.availableCopies} avail.`
                          : "Borrowed"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollRow>
          </section>

          {/* ── New arrivals ───────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              icon={<Sparkles className="w-4 h-4" />}
              title="New Arrivals"
              action="Show all"
            />
            <ScrollRow>
              {MOCK_NEW.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col flex-shrink-0 gap-2 w-[130px]"
                >
                  <BookCover
                    book={book}
                    className="w-[130px] h-[180px]"
                    onClick={() => setSelectedBook(book)}
                  />
                  <div>
                    <p className="font-semibold text-xs truncate">
                      {book.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {book.author}
                    </p>
                    <div className="flex justify-between items-center mt-0.5">
                      <StarRating rating={book.rating} />
                      <Badge
                        variant="secondary"
                        className="px-1.5 py-0 text-[9px]"
                      >
                        New
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollRow>
          </section>

          {/* ── Popular authors ────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              icon={<TrendingUp className="w-4 h-4" />}
              title="Popular Authors"
              action="Show all"
            />
            <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {POPULAR_AUTHORS.map((author) => (
                <button
                  key={author.id}
                  type="button"
                  className="flex flex-col items-center gap-2 bg-card hover:bg-muted/40 hover:shadow-md p-4 border rounded-xl text-center transition-all duration-150"
                >
                  <div
                    className={cn(
                      "flex justify-center items-center rounded-full w-12 h-12 font-bold text-sm",
                      author.color,
                    )}
                  >
                    {author.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-xs leading-tight">
                      {author.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {author.books} books
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Book detail dialog */}
      <BookDetailDialog
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
