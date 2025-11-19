import { useRef, useState, useEffect } from "react";

export default function EditableText({ text, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Resize whenever value changes OR when first shown
  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto"; // reset first
    el.style.height = el.scrollHeight + "px"; // grow to fit content
  };

  // Run when content changes (user typing)
  useEffect(() => {
    if (editing) autoResize();
  }, [value, editing]);

  // Run once when entering edit mode (initial height)
  useEffect(() => {
    if (editing) {
      setValue(text); // sync saved text
      setTimeout(autoResize, 0); // wait for DOM paint
    }
  }, [editing]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {editing ? (
        <>
          <textarea
            ref={textareaRef}
            value={value}
            rows={1} // start small, auto-resize will expand
            onChange={(e) => setValue(e.target.value)}
            className="
              bg-gray-900 border px-2 py-1 rounded text-sm text-white
              overflow-hidden resize-none w-full
            "
          />

          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-600 rounded text-white text-xs"
              onClick={() => {
                onSave(value);
                setEditing(false);
              }}
            >
              Save
            </button>

            <button
              className="px-3 py-1 bg-gray-500 rounded text-white text-xs"
              onClick={() => {
                setValue(text);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <span className="whitespace-pre-line">{text}</span>
          <button
            className="px-2 py-1 bg-blue-600 rounded text-white text-xs"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
