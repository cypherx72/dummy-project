//use memo to optimize re-rendering if needed in future
"use client";
import { toast } from "sonner";

type DateSeparatorProps = {
  currentDate: number;
  previousDate: number | null;
};

export const DateSeparator = ({
  currentDate,
  previousDate,
}: DateSeparatorProps) => {
  if (!previousDate) {
    return <div className="top-0 sticky flex justify-center mb-2 w-full"></div>;
  }

  const currDate = new Date(currentDate);
  const prevDate = new Date(previousDate);

  if (
    currDate.getDate() !== prevDate.getDate() ||
    currDate.getMonth() !== prevDate.getMonth() ||
    currDate.getFullYear() !== prevDate.getFullYear()
  ) {
    return (
      <div className="flex justify-center px-2 w-full">
        <span className="bg-amber-300 p-0.5 rounded-sm font-bold text-black text-xs tracking-wide">
          {formatDate(currentDate)}
        </span>
      </div>
    );
  }
};

// date formater function

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
};
