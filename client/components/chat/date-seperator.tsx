//use memo to optimize re-rendering if needed in future
"use client";
type DateSeparatorProps = {
  date: string;
};

const getParsedDate = (dateString: string) => {
  return Date.parse(dateString);
};

export const DateSeparator = ({ date }: DateSeparatorProps) => {
  const parsedDate = getParsedDate(date);

  return (
    <div className="top-3 z-40 sticky flex flex-row justify-center items-center p-2 rounded-sm w-full font-bold text-amber-500/70 text-xs">
      <span className="bg-white/70 px-1 py-0.5 rounded-sm w-auto font-bold text-black text-xs text-nowrap tracking-wide">
        {formatDate(parsedDate)}
      </span>
    </div>
  );
};

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

  if (day.toString().length === 1) {
    return `0${day} ${month} ${year}`;
  }

  return `${day} ${month} ${year}`;
};
