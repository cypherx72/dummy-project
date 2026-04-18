"use client";
import { RefreshCcwIcon } from "lucide-react";
import { IconType } from "react-icons";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EmptyStateConfig = {
  type: "notifications" | "assignments" | "recents";
  title?: string;
  description?: string;
  Icon: IconType;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function EmptyMuted({
  title,
  description,
  Icon,
  action,
}: EmptyStateConfig) {
  return (
    <Empty className="bg-muted/30 h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <RefreshCcwIcon onClick={action?.onClick} />
          {action?.label}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
