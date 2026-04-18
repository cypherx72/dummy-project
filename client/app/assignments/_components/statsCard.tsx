"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export const StatCard = ({
  icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  onClick?: () => void;
}) => (
  <Item
    variant="outline"
    className={cn(
      "relative justify-center items-center rounded-2xl overflow-hidden",
      onClick && "cursor-pointer hover:shadow-md transition-shadow",
    )}
    onClick={onClick}
  >
    <ItemContent>
      <ItemTitle className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </ItemTitle>
      <ItemDescription className={cn("mt-1 font-bold text-3xl", color)}>
        {value}
      </ItemDescription>
    </ItemContent>
    <ItemMedia
      variant="icon"
      className={cn("p-2.5 rounded-xl size-10", "bg-muted")}
    >
      {icon}
    </ItemMedia>
  </Item>
);
