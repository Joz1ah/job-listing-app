import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Input } from "components";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  tagClassName?: string;
  name?: string;
  onBlur?: (value: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  className,
  tagClassName = "bg-blue-600 hover:bg-blue-700",
  onBlur,
  placeholder = "Add tags...",
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (newTag && !value.includes(newTag)) {
        const newTags = [...value, newTag];
        onChange(newTags);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (onBlur) {
      onBlur(value);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  return (
    <div
      className={`bg-transparent border rounded-md border-gray-300 overflow-hidden ${className || ""}`}
    >
      <div className="max-h-96 overflow-y-auto">
        <div className="flex flex-wrap items-start gap-1 p-2">
          {value.map((tag, index) => (
            <div
              key={index}
              onClick={() => removeTag(index)}
              className={`px-3 py-1 text-sm text-white font-semibold rounded-[2px] cursor-pointer transition-colors h-8 flex items-center ${tagClassName}`}
            >
              {tag}
            </div>
          ))}
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder={
              value.length === 0 && inputValue.length === 0 ? placeholder : ""
            }
            className="!w-auto flex-1 min-w-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-8 p-0 placeholder:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export { TagInput };
