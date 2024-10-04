// components/SearchSuggestionComponent.tsx

import { Gear } from '@prisma/client';
import React, { useState } from 'react';

interface SearchSuggestionComponentProps {
  onAddGear: (gear: Gear) => void;
  onNameChange?: (name: string) => void;
  label: string;
  buttonTxt: string;
  placeholder?: string;
  type?: string;
  searchLimit: number;
  inputClassName?: string;
  suggestionContainerClassName?: string;
}

export const SearchSuggestionComponent: React.FC<SearchSuggestionComponentProps> = ({ onAddGear, onNameChange, label, buttonTxt, placeholder, type, searchLimit, inputClassName,suggestionContainerClassName }) => {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState<Gear[]>([]);

  const handleSearch = async (value: string) => {  
    if (onNameChange) {
      onNameChange(value);
    }
    setName(value);
    if (value.length > 1) {
      const response = await fetch(`/gear/search?q=${value}&limit=${searchLimit}&type=${type}`);
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div>
      <label className="block text-base font-medium mb-1">
        {label}
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
      {suggestions.length > 0 && (
        <ul className={suggestionContainerClassName}>
          {suggestions.map((gear) => (
              <li
                key={gear.id}
                className="p-2 hover:bg-gray-100 cursor-pointer text-black flex justify-between items-center"
              >
              <div>
                <span>{gear.name}</span>
                <img src={gear.img} alt={gear.name} className="w-8 h-8" />
                <button
                  onClick={() => onAddGear(gear)}
                  className="bg-blue-500 text-black py-1 px-2 rounded text-sm hover:bg-blue-600"
                >
                  {buttonTxt}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
