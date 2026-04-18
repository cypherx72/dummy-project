import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar() {
  const [showSearch, setShowSearch] = useState<boolean>(true);
  return (
    <Field orientation="horizontal" className="relative w-md">
      <Input
        type="search"
        className="p-5 font-sans font-medium text-lg tracking-wide"
        placeholder="Search for assignments"
      />
      {showSearch && (
        <Search className="right-5 z-10 absolute size-5 text-zinc-400" />
      )}
    </Field>
  );
}
