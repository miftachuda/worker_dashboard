import React, { useEffect, useRef, useState } from "react";

export interface PlusInputButtonProps {
  /** Called when the user submits a new value */
  onAdd: (value: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Minimum length required to call onAdd (default 1) */
  minLength?: number;
  /** Optional initial open state */
  defaultOpen?: boolean;
  /** Optional Tailwind classes for the wrapper */
  className?: string;
  /** Whether to autofocus the input when opened */
  autoFocus?: boolean;
}

/**
 * PlusInputButton
 * - Renders a circular + button. When clicked it turns into a small text input.
 * - Press Enter to submit, Escape to cancel, or click outside to cancel.
 * - Calls `onAdd(value)` when submitted and value length >= minLength.
 *
 * Usage:
 * <PlusInputButton onAdd={(v) => console.log(v)} placeholder="Add tag" />
 */
export default function PlusInputButton({
  onAdd,
  placeholder = "Add...",
  minLength = 1,
  defaultOpen = false,
  className = "",
  autoFocus = true,
}: PlusInputButtonProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [value, setValue] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && autoFocus) inputRef.current?.focus();
  }, [open, autoFocus]);

  // click outside to close
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setValue("");
      }
    }
    if (open) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [open]);

  function submit() {
    const trimmed = value.trim();
    if (trimmed.length >= minLength) {
      onAdd(trimmed);
      setValue("");
      setOpen(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setValue("");
    }
  }

  return (
    <div className={`inline-block ${className}`} ref={wrapperRef}>
      {!open ? (
        <button
          type="button"
          aria-label="Add"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-700"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="px-3 py-1.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 min-w-[160px]"
            aria-label="New value"
          />
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={submit}
              className="px-3 py-1 rounded-md bg-primary text-black text-sm font-medium hover:bg-primary focus:outline-none focus:ring-2 focus:ring-slate-800"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setValue("");
              }}
              className="px-2 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
