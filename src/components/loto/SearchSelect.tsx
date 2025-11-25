import React, { useState, useRef, useEffect } from "react";

interface SearchableDropdownProps {
  selectedType: string;
  equipmentData: Record<string, string[]>;
  selectedEquipment: string;
  setSelectedEquipment: (value: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  selectedType,
  equipmentData,
  selectedEquipment,
  setSelectedEquipment,
}) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredData =
    equipmentData[selectedType]?.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    ) || [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mb-4" ref={dropdownRef}>
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search or select equipment..."
        value={query || selectedEquipment}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setSelectedEquipment(query);
        }}
        onClick={() => {
          setIsOpen(true);
        }}
      />
      {isOpen && filteredData.length > 0 && (
        <ul className="absolute z-10 w-full max-h-60 overflow-y-auto bg-gray-800 text-white border border-gray-600 rounded mt-1 shadow-lg">
          {filteredData.map((item, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-blue-600 cursor-pointer"
              onClick={() => {
                setSelectedEquipment(item);
                setQuery(item);
                setIsOpen(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
