import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { connectSocket } from "@/lib/socketIO";
import { showToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function useChatSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const socket = connectSocket();

    // handle socket error
    if (!socket) {
      showToast(
        "Expired Session",
        "Your session expired. Please sign-in again. ",
        "info",
      );
      router.push("/auth/signin");
      return;
    }

    setSocket(socket);

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
    });

    socket.on("disconnect", () => {});

    return () => {
      socket.disconnect();
    };
  }, [router]);

  return { socket };
}
