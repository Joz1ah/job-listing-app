import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Input } from 'components';

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  tagClassName?: string;
  name?:string
  onBlur?: (value: string) => void
}

const TagInput: React.FC<TagInputProps> = ({ 
  value, 
  onChange, 
  className,
  tagClassName = "bg-[#184E77] hover:bg-blue-700",
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  
  const tags = value ? value.split(',').filter(tag => tag.trim()) : [];
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange(newTags.join(','));
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      onChange(newTags.join(','));
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
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onChange(newTags.join(','));
  };

  return (
    <div className={`bg-transparent border rounded-md border-gray-300 overflow-hidden ${className || ''}`}>
      <div className="max-h-[99px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <div className="flex flex-wrap items-start gap-1 p-2">
          {tags.map((tag, index) => (
            <div
            key={index}
            onClick={() => removeTag(index)}
              className={`px-3 py-1 text-sm text-white text-[12px] font-semibold rounded-[2px] cursor-pointer transition-colors h-[30px] flex items-center ${tagClassName}`}
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
            className="!w-auto flex-[1_0_120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-8 p-0"
          />
        </div>
      </div>
    </div>
  );
};

export { TagInput }