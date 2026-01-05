"use server";
import { cookies } from "next/headers";

export const getCookie = async () => {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token")?.value;
    return authToken;
  } catch (err) {
    console.log(err);
  }
};

export const getSocketCookie = async () => {
  try {
    const cookieStore = await cookies();
    const socketToken = cookieStore.get("authjs.session-token")?.value;
    return socketToken;
  } catch (err) {
    console.log(err);
  }
};
