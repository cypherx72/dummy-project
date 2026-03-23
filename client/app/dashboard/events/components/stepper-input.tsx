import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function StepperInput({
  value = 1,
  min = 1,
  max = 10,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [internalValue, setInternalValue] = useState(value);

  const updateValue = (newValue: number) => {
    if (newValue < min || newValue > max) return;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center border rounded-lg overflow-hidden">
      {/* MINUS */}
      <button
        type="button"
        onClick={() => updateValue(internalValue - 1)}
        className="hover:bg-zinc-800 px-3 py-1 text-lg"
      >
        −
      </button>

      {/* INPUT */}
      <Input
        type="text"
        value={internalValue}
        onChange={(e) => {
          const val = e.target.value;

          // allow empty input (important UX)
          if (val === "") {
            setInternalValue(0);
            return;
          }

          const num = Number(val);

          if (isNaN(num)) return;

          updateValue(num);
        }}
        className="bg-transparent outline-none w-16 text-center"
      />

      {/* PLUS */}
      <button
        type="button"
        onClick={() => {
          updateValue(internalValue + 1);
        }}
        className="hover:bg-zinc-800 px-3 py-1 text-lg"
      >
        +
      </button>
    </div>
  );
}
