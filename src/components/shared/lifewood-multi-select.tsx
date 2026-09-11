"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface LifewoodMultiSelectProps {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export function LifewoodMultiSelect({
  label,
  placeholder = "Select...",
  options,
  selected,
  onChange,
  className = "",
  disabled = false,
  searchable = false,
}: LifewoodMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(options.map((opt) => opt.value));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-bold text-[#133020] uppercase tracking-wider mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
          isOpen
            ? "border-[#046241] ring-2 ring-[#046241]/20 bg-white"
            : selected.length > 0
            ? "border-[#046241] bg-[#046241]/5 text-[#133020]"
            : "border-[#D8D2C8] bg-white text-[#555555] hover:border-[#046241]/60"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
      >
        <div className="flex items-center gap-1.5 flex-wrap flex-1 text-left truncate">
          {selected.length === 0 ? (
            <span className="text-[#888888] font-normal">{placeholder}</span>
          ) : selected.length <= 2 ? (
            selected.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#046241] text-white text-[10.5px] font-medium"
                >
                  <span>{opt ? opt.label : val}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(val);
                    }}
                    className="hover:text-red-200 transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </span>
              );
            })
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#046241] text-white text-[10.5px] font-bold">
                {selected.length} selected
              </span>
              <span className="text-[11px] text-[#555555] truncate">
                {selected
                  .map((val) => options.find((o) => o.value === val)?.label || val)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selected.length > 0 && (
            <span
              onClick={handleClearAll}
              title="Clear all"
              className="p-1 text-[#888888] hover:text-[#B91C1C] transition cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#133020] transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#046241]" : ""
            }`}
          />
        </div>
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[220px] max-w-sm rounded-xl border border-[#D8D2C8] bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Optional Search */}
          {searchable && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-[#999999] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#D8D2C8] bg-[#F9F7F7] text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241]"
              />
            </div>
          )}

          {/* Quick Select Actions */}
          <div className="flex items-center justify-between px-1.5 py-1 mb-1 border-b border-[#D8D2C8]/60 text-[10.5px]">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[#046241] hover:underline font-bold cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#666666] hover:text-[#B91C1C] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Option List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-[#888888]">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                      isSelected
                        ? "bg-[#046241]/10 text-[#046241] font-bold"
                        : "hover:bg-[#F9F7F7] text-[#133020] font-medium"
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        isSelected
                          ? "bg-[#046241] border-[#046241] text-white"
                          : "border-[#D8D2C8] bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
