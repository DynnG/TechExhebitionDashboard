"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
  region?: string;
  badge?: string;
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
  singleSelect?: boolean;
  activeRegion?: string;
  onSelectAllRegion?: () => void;
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
  singleSelect = false,
  activeRegion,
  onSelectAllRegion,
}: LifewoodMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScope, setFilterScope] = useState<"all" | "region" | "selected">("all");
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
    if (singleSelect) {
      if (!val || (selected.length === 1 && selected[0] === val)) {
        onChange([]);
      } else {
        onChange([val]);
      }
      setIsOpen(false);
      return;
    }
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

  // Filter options based on search and scope
  const filteredOptions = useMemo(() => {
    return options.filter((opt) => {
      const matchesSearch =
        !searchTerm.trim() ||
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.region && opt.region.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterScope === "region" && activeRegion) {
        return opt.region?.toLowerCase() === activeRegion.toLowerCase();
      }
      if (filterScope === "selected") {
        return selected.includes(opt.value);
      }
      return true;
    });
  }, [options, searchTerm, filterScope, activeRegion, selected]);

  // Compute clean display text matching reference UI
  const displayText = useMemo(() => {
    if (selected.length === 0 || (selected.length === 1 && selected[0] === "")) return "";
    if (selected.length === 1) {
      const match = options.find((o) => o.value === selected[0]);
      return match ? match.label : selected[0];
    }
    if (selected.length === 2) {
      const first = options.find((o) => o.value === selected[0])?.label || selected[0];
      const second = options.find((o) => o.value === selected[1])?.label || selected[1];
      return `${first}, ${second}`;
    }
    // If all options in activeRegion are selected
    if (activeRegion && activeRegion !== "All Regions") {
      const regionTotal = options.filter((o) => o.region?.toLowerCase() === activeRegion.toLowerCase());
      const selectedInRegion = regionTotal.filter((o) => selected.includes(o.value));
      if (regionTotal.length > 0 && selectedInRegion.length === regionTotal.length && selected.length === regionTotal.length) {
        return `${activeRegion} (All ${regionTotal.length} countries)`;
      }
    }
    const first = options.find((o) => o.value === selected[0])?.label || selected[0];
    return `${first} (+${selected.length - 1} more)`;
  }, [selected, options, activeRegion]);

  const regionOptionsCount = useMemo(() => {
    if (!activeRegion) return 0;
    return options.filter((o) => o.region?.toLowerCase() === activeRegion.toLowerCase()).length;
  }, [options, activeRegion]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-[#4b5563] mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button - Clean 42px height matching screenshot */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-[42px] px-3.5 rounded-xl border text-sm flex items-center justify-between gap-2 transition-all cursor-pointer text-left ${
          isOpen
            ? "border-[#046241] ring-2 ring-[#046241]/20 bg-white"
            : selected.length > 0
            ? "border-[#d1d5db] bg-white text-[#111827] hover:border-[#9ca3af]"
            : "border-[#d1d5db] bg-white text-[#9ca3af] hover:border-[#9ca3af]"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
      >
        <span className="truncate flex-1 font-normal">
          {displayText || placeholder}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-[#6b7280] shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#046241]" : ""
          }`}
        />
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[260px] max-w-md rounded-xl border border-[#d8d2c8] bg-white p-2.5 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Optional Search */}
          {searchable && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#046241]"
              />
            </div>
          )}

          {/* Scope Filters if activeRegion exists */}
          {activeRegion && regionOptionsCount > 0 && (
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#f3f4f6]">
              <button
                type="button"
                onClick={() => setFilterScope("all")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer transition ${
                  filterScope === "all"
                    ? "bg-[#046241] text-white"
                    : "bg-gray-100 text-[#4b5563] hover:bg-gray-200"
                }`}
              >
                All ({options.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterScope("region")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer transition ${
                  filterScope === "region"
                    ? "bg-[#046241] text-white"
                    : "bg-gray-100 text-[#4b5563] hover:bg-gray-200"
                }`}
              >
                {activeRegion} ({regionOptionsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterScope("selected")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer transition ${
                  filterScope === "selected"
                    ? "bg-[#046241] text-white"
                    : "bg-gray-100 text-[#4b5563] hover:bg-gray-200"
                }`}
              >
                Selected ({selected.length})
              </button>
            </div>
          )}

          {/* Quick Select Actions for multi-select */}
          {!singleSelect && (
            <div className="flex items-center justify-between px-1.5 py-1 mb-1 border-b border-[#f3f4f6] text-[11px]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[#046241] hover:underline font-medium cursor-pointer"
                >
                  Select All
                </button>
                {onSelectAllRegion && activeRegion && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAllRegion();
                      }}
                      className="text-[#046241] hover:underline font-medium cursor-pointer"
                    >
                      Select All {activeRegion}
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[#6b7280] hover:text-[#b91c1c] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Option List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 py-1 pr-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-[#9ca3af]">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected =
                  singleSelect && !opt.value
                    ? selected.length === 0 || selected.includes("")
                    : Boolean(opt.value && selected.includes(opt.value));
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                      isSelected
                        ? "bg-[#046241]/10 text-[#046241] font-semibold"
                        : "hover:bg-[#f9fafb] text-[#1f2937] font-normal"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate">{opt.label}</span>
                      {opt.region && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded font-normal shrink-0">
                          {opt.region}
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition shrink-0 ml-2 ${
                        isSelected
                          ? "bg-[#046241] border-[#046241] text-white"
                          : "border-[#d1d5db] bg-white"
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

