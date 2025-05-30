import React, { useState, useEffect } from 'react';
import { Pencil, Check, Ban } from 'lucide-react';



const EditableField = ({ label, name, value, initialValue, onChange, icon: Icon, type = 'text', options = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Met à jour la valeur temporaire quand la prop `value` change
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleConfirm = () => {
    onChange(name, tempValue); // ✅ corrige ici
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const isUnchanged = value === initialValue;

  const inputClassNames = `flex-1 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    !isEditing && isUnchanged ? 'text-gray-400' : 'text-white'
  }`;

  return (
    <div className="relative mb-3 text-indigo-900">
      <label htmlFor={name} className="flex items-center text-sm font-medium ml-1 mb-1">
        {Icon && <Icon className="mr-2 text-indigo-900" />}
        {label}
      </label>
      <div className="flex items-center">
        {options.length > 0 ? (
          <select
            label={label}
            name={name}
            id={name}
            disabled={!isEditing}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)} // ✅ seulement setTempValue ici
            className={inputClassNames}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            label={label}
            id={name}
            type={type}
            name={name}
            value={tempValue}
            disabled={!isEditing}
            onChange={(e) => setTempValue(e.target.value)} // ✅ seulement setTempValue ici
            className={inputClassNames}
          />
        )}
        <div className="ml-2 flex items-center">
          {isEditing ? (
            <>
              <button type="button" onClick={handleConfirm} className="text-green-700 hover:text-green-900">
                <Check />
              </button>
              <button type="button" onClick={handleCancel} className="ml-2 text-red-700 hover:text-red-900">
                <Ban />
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="text-blue-700 hover:text-blue-900">
              <Pencil />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableField;
