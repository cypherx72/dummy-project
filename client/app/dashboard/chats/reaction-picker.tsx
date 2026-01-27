"use client";
import { Button } from "@/components/ui/button";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

export function ReactionPicker({
  onSelectEmoji,
  className,
}: {
  onSelectEmoji: (emoji: string) => void;
  className?: string;
}) {
  const { recent, pushReaction } = useRecentReactions();
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleEmojiClick = (emoji: string) => {
    pushReaction(emoji);
    onSelectEmoji(emoji);
    setShowPicker(false);
  };

  return (
    <div
      className={`reaction-wrapper bg-neutral-700 rounded-2xl ${
        className || ""
      }`}
    >
      <div className="reaction-bar">
        {recent.map((emoji, idx) => (
          <Button
            key={idx}
            onClick={() => handleEmojiClick(emoji)}
            className="p-2 text-xl"
            variant="ghost"
          >
            {emoji}
          </Button>
        ))}

        <Button
          variant="ghost"
          className="bg-neutral-500 p-0 rounded-full text-xl"
          onClick={() => setShowPicker((prevState) => !prevState)}
        >
          <FaPlus />
        </Button>
      </div>

      {showPicker && (
        <div className="emoji-wrapper">
          <EmojiPicker
            onEmojiClick={(e: EmojiClickData) => handleEmojiClick(e.emoji)}
            skinTonesDisabled
            height={500}
            width={500}
            theme={Theme.AUTO}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
}

const MAX_RECENTS = 6;
const STORAGE_KEY = "recent-reactions";

const DEFAULT_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function useRecentReactions() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return;
    const parsedStored = JSON.parse(stored);
    const reactions = parsedStored.concat(
      DEFAULT_REACTIONS.slice(0, MAX_RECENTS - parsedStored.length)
    );

    setRecent(reactions);
  }, []);

  const pushReaction = (emoji: string) => {
    setRecent((prev) => {
      if (recent.includes(emoji)) {
        const updated = [emoji, ...prev.filter((e) => e !== emoji)];
        return updated;
      }

      const updated = [emoji, ...prev.filter((e) => e !== emoji)].slice(
        0,
        MAX_RECENTS
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    recent: recent.length ? recent : DEFAULT_REACTIONS,
    pushReaction,
  };
}
