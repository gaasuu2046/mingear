// components/FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'textarea' | 'number' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  rows?: number;
  min?: string;
  step?: string;
  placeholder?: string;
  options?: string[];
  error?: string;
  onInvalid?: (e: React.InvalidEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  rows = 4,
  placeholder,
  options = [],
  error,
  onInvalid,
  onInput,
}) => {
  return (
    <div className="text-black w-full max-w-2xl">
      <label htmlFor={id} className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : type === 'select' ? (
       <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onInvalid={onInvalid}
          onInput={onInput}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
