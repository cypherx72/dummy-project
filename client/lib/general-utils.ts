import crypto from "crypto";

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s > 9 ? s : `0${s}`}`;
};

export const formatInitials = (name: string) => {
  const [firstName, lastName] = name.split(" ");
  return firstName[0] + lastName[0];
};

export const generateOTP = (length: number) => {
  return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length));
};

export const formatDate = (date: string): string => {
  const newDate = new Date(date);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = newDate.getFullYear();
  const month = months[newDate.getMonth()];
  const day = newDate.getDate();

  let hours = newDate.getHours();
  const minutes = newDate.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
};
