"use client";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FcLike } from "react-icons/fc";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LuSlidersVertical } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FaSearch } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { GiMaterialsScience } from "react-icons/gi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { VscLaw } from "react-icons/vsc";
import { SiCodechef } from "react-icons/si";
import { GiRolledCloth } from "react-icons/gi";
import { GiBlackBook } from "react-icons/gi";
import { RiDashboardHorizontalLine } from "react-icons/ri";
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const libraryStore = [
  {
    id: 1,
    url: "https://covers.openlibrary.org/b/id/10523365-L.jpg",
    title: "Atomic Habits",
    author: "James Clear",
    description: "A guide to building good habits and breaking bad ones.",
    like: true,
    reading: 245,
    yearPublished: 2018,
    genre: "Self-help",
  },
  {
    id: 2,
    url: "https://covers.openlibrary.org/b/id/11153272-L.jpg",
    title: "Educated",
    author: "Tara Westover",
    description:
      "A memoir about growing up in a strict survivalist family and pursuing education.",
    like: false,
    reading: 132,
    yearPublished: 2018,
    genre: "Memoir",
  },
  {
    id: 3,
    url: "https://covers.openlibrary.org/b/id/10233869-L.jpg",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description:
      "Explores the history and impact of Homo sapiens on the world.",
    like: true,
    reading: 420,
    yearPublished: 2011,
    genre: "History",
  },
  {
    id: 4,
    url: "https://covers.openlibrary.org/b/id/10082202-L.jpg",
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "A novel about regrets, choices, and infinite lives lived.",
    like: true,
    reading: 187,
    yearPublished: 2020,
    genre: "Fiction",
  },
  {
    id: 5,
    url: "https://covers.openlibrary.org/b/id/11148958-L.jpg",
    title: "Becoming",
    author: "Michelle Obama",
    description:
      "A deeply personal memoir by the former First Lady of the United States.",
    like: false,
    reading: 365,
    yearPublished: 2018,
    genre: "Autobiography",
  },
  {
    id: 6,
    url: "https://covers.openlibrary.org/b/id/11205441-L.jpg",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    description: "A counterintuitive approach to living a good life.",
    like: true,
    reading: 290,
    yearPublished: 2016,
    genre: "Self-help",
  },
  {
    id: 7,
    url: "https://covers.openlibrary.org/b/id/10909258-L.jpg",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description:
      "A coming-of-age murder mystery set in the marshes of North Carolina.",
    like: true,
    reading: 314,
    yearPublished: 2018,
    genre: "Fiction",
  },
  {
    id: 8,
    url: "https://covers.openlibrary.org/b/id/10414564-L.jpg",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description:
      "An exploration of two systems of thought: fast, intuitive thinking and slow, deliberate thinking.",
    like: false,
    reading: 220,
    yearPublished: 2011,
    genre: "Psychology",
  },
];

export const authors = [
  {
    id: 1,
    name: "Austin Kleon",
    role: "Writer & Author",
    books: 76,
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1",
  },
  {
    id: 2,
    name: "J.K. Rowling",
    role: "Author",
    books: 85,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    id: 3,
    name: "George R.R. Martin",
    role: "Author & Writer",
    books: 92,
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
  },
  {
    id: 4,
    name: "Malcolm Gladwell",
    role: "Writer & Author",
    books: 61,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
  {
    id: 5,
    name: "Neil Gaiman",
    role: "Writer",
    books: 78,
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  },
  {
    id: 6,
    name: "Toni Morrison",
    role: "Author",
    books: 54,
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    id: 7,
    name: "Stephen King",
    role: "Author & Writer",
    books: 120,
    image: "https://images.unsplash.com/photo-1502767089025-6572583495b0",
  },
];

const availableBooks = [
  {
    category: "Science",
    quantity: 1200,
    icon: GiMaterialsScience,
    color: "",
  },
  {
    category: "Arts",
    quantity: 1400,
    icon: VscLaw,
  },
  {
    category: "Commerce",
    quantity: 1800,
    icon: MdOutlineAccountBalance,
  },
  {
    category: "Design",
    quantity: 80,
    icon: GiRolledCloth,
  },
  {
    category: "Cooking",
    quantity: 1200,
    icon: SiCodechef,
  },
  {
    category: "Others",
    quantity: 900,
    icon: GiBlackBook,
  },
];

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // send a request to database to search for a task
  }
  const submitValue = form.watch("username");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col bg-slate-900 overflow-x-hidden">
        <nav>
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
        </nav>
        <main className="flex flex-row gap-8 bg-slate-900 py-8 pl-2 w-full h-full overflow-x-hidden">
          {/* first section */}
          <section className="flex flex-col gap-8 rounded-2xl w-7/12 h-full">
            <article className="flex flex-col gap-4 p-4 border-2 border-gray-700 rounded-2xl h-[45lvh]">
              <span className="flex flex-row justify-between items-center px-10">
                <p className="font-bold text-white/80 text-3xl">
                  Recommended Books
                </p>
                <Button
                  variant="secondary"
                  className="bg-white/5 font-semibold tracking-wide"
                >
                  Filter
                  <LuSlidersVertical />
                </Button>
              </span>
              <section className="flex flex-row px-10">
                <Carousel className="w-full h-full">
                  <CarouselContent className="gap-0">
                    {libraryStore.map((book) => (
                      <CarouselItem key={book.id} className="basis-1/4">
                        <Card className="flex flex-col gap-0 p-0 rounded-lg h-[32vh]">
                          <div className="relative rounded-t-lg w-full h-2/3">
                            <Image
                              src={book.url}
                              alt={book.title}
                              fill
                              className="rounded-t-lg object-cover"
                            />
                          </div>

                          <div className="flex flex-col justify-between p-3 rounded-b-lg h-1/3 text-white">
                            <div className="flex justify-between items-center rounded-b-lg">
                              <Link
                                className="font-semibold text-lg hover:underline underline-offset-1 truncate"
                                href={"#"}
                              >
                                {book.title}
                              </Link>
                              <Button variant="ghost" className="p-0">
                                <FcLike
                                  className={`text-${
                                    book.like ? "red-500" : "white"
                                  } text-2xl`}
                                />
                              </Button>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <p>{book.author}</p>
                              <span className="flex flex-col items-end leading-tight">
                                <p className="font-bold text-amber-400">
                                  {book.reading}
                                </p>
                                <p className="text-xs">reading</p>
                              </span>
                            </div>
                          </div>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </section>
            </article>
            <article className="flex flex-col p-4 border-2 border-gray-700 rounded-2xl w-full">
              <p className="px-10 font-bold text-white/80 text-3xl">
                Category Section
              </p>
              <Card className="grid grid-cols-3 px-10 border-none rounded-2xl w-full">
                {availableBooks.map((book) => (
                  <Card
                    key={book.category}
                    className="flex flex-row justify-between items-center"
                  >
                    <CardHeader className="flex flex-col justify-between">
                      <CardTitle className="font-bold text-amber-500 text-2xl">
                        {book.category}
                      </CardTitle>
                      <CardDescription>
                        {<book.icon className="text-white/30 text-5xl" />}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="flex flex-col justify-between items-center">
                        <p className="font-semibold text-amber-400 text-xl tracking-wider">
                          {book.quantity}
                        </p>
                        <p className="text-white/80 text-sm">Books available</p>
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </Card>
            </article>
            <article className="flex flex-col gap-4 p-4 border-2 border-gray-700 rounded-2xl h-[45lvh]">
              <span className="flex flex-row justify-between items-center px-10">
                <p className="font-bold text-white/80 text-3xl">New Books</p>
                <Button
                  variant="secondary"
                  className="bg-white/5 font-semibold tracking-wide"
                >
                  Filter
                  <LuSlidersVertical />
                </Button>
              </span>
              <section className="flex flex-row px-10">
                <Carousel className="w-full h-full">
                  <CarouselContent className="gap-0">
                    {libraryStore.map((book) => (
                      <CarouselItem key={book.id} className="basis-1/4">
                        <Card className="flex flex-col gap-0 p-0 rounded-lg h-[32vh]">
                          <div className="relative rounded-t-lg w-full h-2/3">
                            <Image
                              src={book.url}
                              alt={book.title}
                              fill
                              className="rounded-t-lg object-cover"
                            />
                          </div>

                          <div className="flex flex-col justify-between p-3 rounded-b-lg h-1/3 text-white">
                            <div className="flex justify-between items-center rounded-b-lg">
                              <Link
                                className="font-semibold text-lg hover:underline underline-offset-1 truncate"
                                href={"#"}
                              >
                                {book.title}
                              </Link>
                              <Button variant="ghost" className="p-0">
                                <FcLike
                                  className={`text-${
                                    book.like ? "red-500" : "white"
                                  } text-2xl`}
                                />
                              </Button>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <p>{book.author}</p>
                              <span className="flex flex-col items-end leading-tight">
                                <p className="font-bold text-amber-400">
                                  {book.reading}
                                </p>
                                <p className="text-xs">reading</p>
                              </span>
                            </div>
                          </div>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </section>
            </article>
          </section>
          {/* second section */}
          <section className="flex flex-col flex-1 gap-8 pr-4 rounded-2xl h-full">
            {/* first article */}
            <article className="flex flex-col gap-2 px-4 py-3 border-2 border-gray-700 rounded-2xl max-h-[60lvh]">
              <span className="flex flex-row justify-between items-center px-3">
                <p className="font-bold text-white/80 text-3xl">
                  Trending Books
                </p>
                <Button
                  variant="secondary"
                  className="bg-white/5 font-semibold tracking-wide"
                >
                  Show All
                  <RiDashboardHorizontalLine />
                </Button>
              </span>
              <article
                className={`gap-4 grid grid-cols-4 p-2 rounded-2xl w-full transition-all duration-300 overflow-hidden
                }`}
              >
                {libraryStore.map((book) => (
                  <Card
                    className="flex flex-col gap-0 p-0 rounded-lg h-[21lvh]"
                    key={book.id}
                  >
                    <CardHeader className="relative rounded-t-lg w-full h-2/3">
                      <Image
                        src={book.url}
                        alt={book.title}
                        fill
                        className="absolute rounded-t-lg object-cover"
                      />
                    </CardHeader>

                    <CardContent className="flex flex-col justify-between gap-1 px-1 py-1 rounded-b-lg h-1/3 text-white">
                      <div className="flex flex-col justify-between items-start rounded-b-lg">
                        <Link
                          className="block w-full font-bold text-sm hover:underline underline-offset-1"
                          href={"#"}
                        >
                          <p className="w-full truncate">{book.title}</p>
                        </Link>

                        <p className="font-semibold text-xs">{book.author}</p>
                        <span className="flex flex-row justify-between items-center w-full">
                          <p className="text-xs tracking-wider">Reading</p>
                          <p className="pr-1 text-amber-400 text-xs">
                            <Badge
                              variant="secondary"
                              className="p-[0.5px] rounded-sm"
                            >
                              {book.reading}
                            </Badge>
                          </p>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </article>
            </article>
            {/* second article */}
            <article className="flex flex-col gap-2 px-4 py-3 border-2 border-gray-700 rounded-2xl max-h-[47lvh]">
              <span className="flex flex-row justify-between items-center px-3">
                <p className="font-bold text-white/80 text-3xl">
                  Writers and Authors
                </p>
                <Button
                  variant="secondary"
                  className="bg-white/10 font-semibold tracking-wide"
                >
                  Show All
                  <RiDashboardHorizontalLine />
                </Button>
              </span>
              <article
                className={`gap-4 grid grid-cols-3 p-2 rounded-2xl w-full transition-all duration-300 overflow-hidden
                }`}
              >
                {authors.map((author) => (
                  <Card
                    className="flex flex-col gap-3 px-1 py-3 rounded-lg h-[18lvh]"
                    key={author.id}
                  >
                    <CardHeader className="relative flex flex-row justify-between items-center rounded-t-lg">
                      <CardTitle className="">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={author.image} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </CardTitle>
                      <CardDescription className="flex flex-col gap-2">
                        <p className="font-semibold text-amber-500">
                          {author.books}
                        </p>
                        <p className="text-white/50">Books</p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                      <p className="font-semibold text-white/70 truncate tracking-wider">
                        {author.name}
                      </p>
                      <p className="text-white/20 text-sm">{author.role}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="#" className="text-amber-500 text-sm">
                        More...
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </article>
            </article>
            <article className="flex flex-col gap-2 px-4 py-3 border-2 border-gray-700 rounded-2xl max-h-[30lvh]">
              <span className="flex flex-row justify-between items-center px-3">
                <p className="font-bold text-white/80 text-3xl">
                  Special Books
                </p>
                <Button
                  variant="secondary"
                  className="bg-white/5 font-semibold tracking-wide"
                >
                  Show All
                  <RiDashboardHorizontalLine />
                </Button>
              </span>
              <article
                className={`gap-4 grid grid-cols-4 p-2 rounded-2xl w-full transition-all duration-300 overflow-hidden
                }`}
              >
                {libraryStore.map((book) => (
                  <Card
                    className="flex flex-col gap-0 p-0 rounded-lg h-[21lvh]"
                    key={book.id}
                  >
                    <div className="relative rounded-t-lg w-full h-2/3">
                      <Image
                        src={book.url}
                        alt={book.title}
                        fill
                        className="absolute rounded-t-lg object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between px-1 rounded-b-lg h-1/3 text-white">
                      <div className="flex flex-col justify-between items-start rounded-b-lg">
                        <Link
                          className="font-bold text-sm hover:underline underline-offset-1 text-wrap"
                          href={"#"}
                        >
                          <p className="truncate">{book.title}</p>
                        </Link>
                        <p className="font-semibold text-xs">{book.author}</p>
                        <span className="flex flex-row justify-between items-center w-full">
                          <p className="text-xs tracking-wider">Reading</p>
                          <p className="pr-1 text-amber-400 text-xs">
                            <Badge
                              variant="secondary"
                              className="p-[0.5px] rounded-sm"
                            >
                              {book.reading}
                            </Badge>
                          </p>
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </article>
            </article>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
// is this
