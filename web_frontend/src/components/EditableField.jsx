import React, { useState, useEffect } from 'react';
import { Pencil, Check, Ban, icons } from 'lucide-react';

const EditableField = ({ label, name, value, initialValue, onChange, icon: Icon, type = 'text', options = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Synchroniser quand la valeur externe change
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleConfirm = () => {
    onChange(name, tempValue);
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
    <div className="relative mb-3  text-indigo-900 ">
      <label className="flex items-center text-sm font-medium  ml-1 mb-1">
        {Icon && <Icon className="mr-2 text-indigo-900" />}
        {label}
      </label>
      <div className="flex items-center">
        {options.length > 0 ? (
          <select
            disabled={!isEditing}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
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
            type={type}
            name={name}
            value={tempValue}
            disabled={!isEditing}
            onChange={(e) => setTempValue(e.target.value)}
            className={inputClassNames}
          >
          </input>
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
            <button type="button" onClick={() => setIsEditing(true)} className="text-orange-500 hover:text-orange-400">
              <Pencil />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableField;
