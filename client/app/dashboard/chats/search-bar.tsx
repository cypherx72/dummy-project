import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdSearch } from "react-icons/md";
import { DialogTitle } from "@radix-ui/react-dialog";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const MessageSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<any>(null);

  const cacheRef = useRef<Map<string, any>>(new Map());

  const fetchSearchResults = useCallback(async (query: string) => {
    if (cacheRef.current.has(query)) {
      return cacheRef.current.get(query);
    }

    console.log("Calling API to get search results.");

    const results = "dummy data"; // replace with real API
    cacheRef.current.set(query, results);

    return results;
  }, []);

  useEffect(() => {
    if (!debouncedSearchTerm) return;

    fetchSearchResults(debouncedSearchTerm).then(setSearchResults);
  }, [debouncedSearchTerm, fetchSearchResults]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={(e) => e.stopPropagation()}>
          <MdSearch />
        </Button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/0 backdrop-blur-none" />
      <DialogContent
        showCloseButton={false}
        className="top-20 left-6/7 fixed flex flex-col p-0 w-xs"
      >
        <DialogTitle className="hidden">Search Bar</DialogTitle>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isFocused && searchQuery.length > 0 && (
          <div className="search-results">
            rendering results...
            {/* Render search results */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
