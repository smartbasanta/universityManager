import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { Button } from "./button";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const TagInput = ({
  value = [],
  onChange,
  placeholder,
  disabled = false,
}: TagInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const trimmed = input.trim();

      if (!value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }

      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    if (disabled) return;
    
    console.log(tag);
    const newTags = value.filter((t) => t !== tag);
    onChange(newTags);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            className="flex items-center gap-2 p-2 text-[14px] my-2"
          >
            {tag}
            {!disabled && (
              <Button
                variant={"ghost"}
                type="button"
                size={"sm"}
                className="size-5"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3 cursor-pointer" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => !disabled && setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Enter tag and press Enter"}
        className="w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
        disabled={disabled}
        readOnly={disabled}
      />
    </div>
  );
};
