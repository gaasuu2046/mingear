// components/AutocompleteField.tsx
import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [value, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectOption = (option: string) => {
    onChange(option);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative text-black">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelectOption(option)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
