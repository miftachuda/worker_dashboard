import { pb } from "@/lib/pocketbase";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { shiftNow, get5AroundShift } from "@/lib/shift";
import ReportForm from "@/types/ReportForm";
import { se } from "date-fns/locale";
import { toast } from "react-toastify";
import { sendNotif } from "@/lib/sendnotif";

const mapRecordToForm = (r: any): ReportForm => ({
  date: dayjs(r.date), // 🔧 ensure Dayjs object
  shift: r.shift ?? "",
  isSubmit: r.isSubmit ?? false,
  content: {
    "002": r.content?.["002"] ?? [""],
    "021": r.content?.["021"] ?? [""],
    "022": r.content?.["022"] ?? [""],
    "023": r.content?.["023"] ?? [""],
    "024": r.content?.["024"] ?? [""],
    "025": r.content?.["025"] ?? [""],
    "041": r.content?.["041"] ?? [""],
    note: r.content?.note ?? [""],
  },
});

export function CreateReport() {
  const [mode, setMode] = useState("list");
  const [submitting, setSubmitting] = useState(false);
  const [clear, setClear] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [draftId, setDraftId] = useState(null);

  const shift = shiftNow();
  const [shiftOptions, setShiftOptions] = useState<string[]>([]);

  useEffect(() => {
    const list = get5AroundShift();
    setShiftOptions(list);
  }, []);

  // ---------------------------
  // FIX: date MUST be Dayjs object
  // ---------------------------
  const emptyForm: ReportForm = {
    date: dayjs(), // 🔧 FIXED (was string)
    shift: shift,
    isSubmit: false,
    content: {
      "002": [""],
      "021": [""],
      "022": [""],
      "023": [""],
      "024": [""],
      "025": [""],
      "041": [""],
      note: [""],
    },
  };

  // ---------------------------
  // STATE
  // ---------------------------
  const [form, setForm] = useState<ReportForm>(emptyForm);

  // ---------------------------
  // FETCH ONLINE DRAFT
  // ---------------------------
  const fetchDraft = async () => {
    console.log("fetchDraft called");
    try {
      const res = await pb.collection("reports").getList(1, 1, {
        filter: "isSubmit = false",
        sort: "-created",
      });

      if (res.items.length > 0) {
        const record = mapRecordToForm(res.items[0]);
        setForm(record); // 🔧 Now correct type
        setDraftId(res.items[0].id);
      }
    } catch (err) {
      console.error("Error fetching draft:", err);
    }
  };
  useEffect(() => {
    fetchDraft();
  }, []);

  // ---------------------------
  // CHANGE HANDLER
  // ---------------------------
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // ---------------------------
  // SAVE OR SUBMIT
  // ---------------------------
  async function handleSubmit(e, submitType = "save") {
    e.preventDefault();
    setError(null);

    try {
      if (!form.date || !form.content) {
        throw new Error("Please fill date and content");
      }

      const record = {
        date: form.date.toISOString(), // 🔧 convert Dayjs → string for PB
        shift: form.shift,
        isSubmit: submitType === "submit",
        content: form.content,
      };

      let saved;

      if (submitType === "save") {
        setSaving(true);

        try {
          if (draftId) {
            saved = await pb.collection("reports").update(draftId, record);
          } else {
            saved = await pb.collection("reports").create(record);
            setDraftId(saved.id);
          }
          toast.success("Draft Saved");
        } catch (error) {
          toast.error("Error Saving Draft");
        }

        setSaving(false);
        return;
      }

      // FINAL SUBMIT
      setSubmitting(true);
      const formatTanggal = (isoString) => {
        const date = new Date(isoString);

        const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
        const tanggal = date.getDate();
        const bulan = date.toLocaleDateString("id-ID", { month: "long" });
        const tahun = date.getFullYear();

        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

        return `${capitalize(hari)}, ${tanggal}-${capitalize(bulan)}-${tahun}`;
      };
      try {
        if (draftId)
          saved = await pb.collection("reports").update(draftId, record);
        else saved = await pb.collection("reports").create(record);
        toast.success("Report Submitted");
        await sendNotif({
          title: "[Report] Created",
          page: "reports",
          message: `${record.shift} ${formatTanggal(
            record.date
          )} has been created.`,
        });
      } catch (error) {
        toast.error("Error Submitting");
      }

      setSubmitting(false);
      setDraftId(null);
      setForm(emptyForm);
      setMode("list");
    } catch (err) {
      setError(err.message || String(err));
      toast.success("Something When Wrong");
    }
  }
  async function handleClear() {
    try {
      setClear(true);
      if (draftId) {
        await pb.collection("reports").delete(draftId);
        setDraftId(null);
        setForm(emptyForm);
      } else {
        setForm(emptyForm);
      }
      setClear(false);
    } catch (err) {
      setError(err.message || String(err));
      setClear(false);
      toast.error("Error Clearing Draft");
    }
  }

  // ---------------------------
  // CREATE UI
  // ---------------------------
  if (mode === "create") {
    return (
      <div className="p-6 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Buat Laporan</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form className="space-y-4 text-[10px]">
          <div className="flex flex-row space-x-3">
            <div>
              <label className="block">Date</label>

              <input
                type="date"
                value={form.date.format("YYYY-MM-DD")}
                onChange={
                  (e) => setForm({ ...form, date: dayjs(e.target.value) }) // 🔧 FIX
                }
                className="mt-1 w-full border rounded p-2 bg-gray-900 text-white
                  border-gray-700 focus:ring-2 focus:ring-blue-500
                  [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>

            <div>
              <label className="block">Shift</label>
              <select
                name="shift"
                value={form.shift}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2 bg-gray-900 text-white"
              >
                {shiftOptions.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LIST EDITOR */}
          <div className="space-y-4">
            {Object.entries(form.content).map(([key, list]) => (
              <div key={key} className="border p-3 rounded">
                <label className="font-semibold">{key}</label>

                {list.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mt-1">
                    <textarea
                      ref={(el) => {
                        if (!el) return;
                        el.style.height = "auto";
                        el.style.height = el.scrollHeight + "px";
                      }}
                      value={item}
                      onChange={(e) => {
                        const updated = { ...form.content };
                        updated[key][index] = e.target.value;
                        setForm({ ...form, content: updated });

                        // auto-resize on typing
                        const el = e.target;
                        el.style.height = "auto";
                        el.style.height = el.scrollHeight + "px";
                      }}
                      className="w-full border rounded p-1 bg-gray-900 text-white overflow-hidden resize-none"
                      rows={1}
                    />

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...form.content };
                          updated[key] = updated[key].filter(
                            (_, i) => i !== index
                          );
                          setForm({ ...form, content: updated });
                        }}
                        className="px-2 py-1 bg-red-600 rounded text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...form.content };
                    updated[key] = [...updated[key], ""];
                    setForm({ ...form, content: updated });
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 rounded text-white"
                >
                  + Tambah kegiatan
                </button>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "save")}
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white p-2 rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, "submit")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => handleClear()}
              className="flex-1 bg-stone-600 hover:bg-gray-400 p-2 rounded"
            >
              {clear ? "Clearing..." : "Clear"}
            </button>
            <button
              type="button"
              onClick={() => setMode("list")}
              className="flex-1 bg-red-400 hover:bg-gray-400 p-2 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="mb-4">
      <button
        onClick={() => setMode("create")}
        className="px-4 py-2 m-4  rounded bg-neon-green text-black "
      >
        Buat Laporan
      </button>
    </div>
  );
}
