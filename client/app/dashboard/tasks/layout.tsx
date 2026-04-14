import { redirect } from "next/navigation";

export default function DashboardTasksLayoutRedirect() {
  redirect("/tasks");
}
