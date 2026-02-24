"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPaperclip } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { LuSmilePlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Image from "next/image";
import { BsReplyAllFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { useChatUI } from "@/app/dashboard/chats/layout";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { EmojiClickData, Theme } from "emoji-picker-react";
import { MediaSchema } from "@/config/ZodSchema";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { MdCancel } from "react-icons/md";

export const MessageInput = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string[]>([]);
  const [emojiPickerTheme, setEmojiPickerTheme] = useState<Theme>(Theme.DARK);
  const {
    sendMessage,
    handleInputChange,
    activeChatId,
    setContextMenuMessageId,
    contextMenuMessageId,
  } = useChatUI();

  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const emojiButtonRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,

    setValue,
  } = useForm({
    defaultValues: {
      message: "",
    },
  });

  const message = getValues("message");

  useEffect(() => {
    if (!emojiPickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(target)
      ) {
        setEmojiPickerOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [emojiPickerOpen]);

  async function onSubmitMessage({ message }) {
    if (!message?.trim() && !imagePreview) return;

    if (!activeChatId) {
      return null;
    }

    try {
      sendMessage({
        chatId: activeChatId,
        content: message?.trim(),
        media: imagePreview || undefined,
        replyToId: contextMenuMessageId?.id,
      });

      setImagePreview(null);
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError([]);
    const files = e.target.files;

    if (!files || files.length !== 1 || !files[0]) {
      setError((prevErr) => [...prevErr, "Please select at least one file."]);
      return;
    }

    const file = files[0];

    // Validate file
    const result = MediaSchema.safeParse(file);
    if (!result.success) {
      const errObj = JSON.parse(result.error.message);
      for (const err of errObj) {
        setError((prevErr) => [...prevErr, err?.message]);
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bottom-0 z-50 absolute flex flex-col gap-1 p-2 pt-0 w-full t">
      {emojiPickerOpen && (
        <div
          ref={emojiPickerRef}
          className="bottom-[100px] left-32 z-50 absolute emoji-wrapper"
        >
          <EmojiPicker
            onEmojiClick={(e: EmojiClickData) => {
              setValue("message", message + e.emoji, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
            emojiStyle={EmojiStyle.APPLE}
            skinTonesDisabled
            theme={emojiPickerTheme}
          />
        </div>
      )}

      {imagePreview && (
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Preview"
              width={80}
              height={80}
              className="border border-zinc-700 rounded-lg object-cover"
            />
            <Button
              type="button"
              onClick={removeImage}
              className="-top-1.5 -right-1.5 absolute p-0 rounded-full w-5 h-5"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {contextMenuMessageId && (
        <div className="flex flex-row justify-between items-start gap-2 shadow-neutral-950 shadow-sm p-1.5 rounded-md w-1/2">
          <div className="flex flex-col justify-center items-start gap-y-0 w-9/10">
            <span className="flex flex-row gap-x-1 bg-neutral-500 p-1 rounded-md rounded-b-none text-neutral-950 items">
              <BsReplyAllFill className="" />{" "}
              <span className="flex flex-row justify-between items-start font-sans font-semibold text-xs tracking-wide">
                <p>Reply to {contextMenuMessageId.sender?.name}</p>
              </span>
            </span>

            <p className="bg-neutral-500 p-1 rounded-md rounded-t-none rounded-r-md min-w-2/5 max-w-4/5 font-sans text-neutral-950 text-sm truncate tracking-wide">
              {contextMenuMessageId?.content}
            </p>
          </div>
          <MdCancel
            className=""
            onClick={() => setContextMenuMessageId(null)}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmitMessage)}
        className="flex items-end gap-1 bg-neutral-900 p-2 border-1 rounded-md"
      >
        <div ref={emojiButtonRef}>
          <LuSmilePlus
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
            className="p-2 cursor-pointer"
            size={35}
          />
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <Button
          type="button"
          variant="ghost"
          className={`p-2 ${imagePreview ? "text-amber-500" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <FaPaperclip />
        </Button>

        <Textarea
          {...register("message")}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange(event)
          }
          placeholder="Type a message"
          className="flex-1 p-2 pt-1 border-none focus-visible:ring-0 min-h-8 max-h-24 font-sans text-sm align-bottom leading-6 tracking-wider no-scrollbar"
        />

        <Button
          type="submit"
          variant="ghost"
          // disabled={!message.trim() && !imagePreview}
        >
          <IoSendSharp />
        </Button>
      </form>
    </div>
  );
};
