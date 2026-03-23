"use client";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

interface LoadingStateProps {
  title?: string;
  description?: string;
  fullScreen?: boolean;
}

export default function LoadingState({
  title = "Loading...",
  description = "Please wait while we prepare everything.",
  fullScreen = true,
}: LoadingStateProps) {
  return (
    <div
      className={
        fullScreen ? "w-full h-full flex items-center justify-center" : ""
      }
    >
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner className="size-6" />
          </EmptyMedia>

          <EmptyTitle>{title}</EmptyTitle>

          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent />
      </Empty>
    </div>
  );
}
