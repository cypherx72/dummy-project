import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useChatMutations } from "@/app/hooks/chat/useChatMutations";
import { Trash2Icon } from "lucide-react";
import { useChatUI } from "@/context/chat/chat-context";

export const DeleteDialog = () => {
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    activeChatId,
    contextMenuMessage,
  } = useChatUI();

  const { deleteMessage } = useChatMutations();
  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <span className="flex flex-row gap-2 text-destructive dark:text-destructive">
            <Trash2Icon /> Delete message?
          </span>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this message from this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteMessage({
                chatId: activeChatId as string,
                messageId: contextMenuMessage?.id as string,
              })
            }
            className="bg-red-500 hover:bg-red-500/80"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
