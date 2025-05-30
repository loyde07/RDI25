import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ icon: Icon, options = [], placeholder = 'Sélectionnez une option', value, onChange }) => {
	const [open, setOpen] = useState(false);

	const handleSelect = (option) => {
		onChange(option);
		setOpen(false);
	};

	return (
		<div className="relative mb-6">
			<div
				className="flex items-center w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg border border-gray-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer"
				onClick={() => setOpen(!open)}
			>
				{value?.label || placeholder}
				<ChevronDown className="ml-auto text-gray-400" />
			</div>
			<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<Icon className="size-5 text-blue-500" />
			</div>
			{open && (
				<ul className="absolute z-20 mt-2 w-full max-h-40 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
					{options.map((option) => (
						<li
							key={option.value}
							className="px-4 py-2 hover:bg-blue-600 cursor-pointer text-white"
							onClick={() => handleSelect(option)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Select;
