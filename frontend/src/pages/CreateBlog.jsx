import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { ImagePlus, UploadCloud, FileText, Clock3, Hash } from "lucide-react";

import toast from "react-hot-toast";

import API from "../services/api";
import Navbar from "../components/Navbar";

function CreateBlog() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const categories = [
    "Technology",
    "React",
    "Node",
    "MongoDB",
    "JavaScript",
    "AI",
    "Security",
  ];

  const [category, setCategory] = useState("Technology");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);

      if (file) {
        formData.append("image", file);
      }

      formData.append("category", category);
      await API.post("/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  return () => {
    if (preview) URL.revokeObjectURL(preview);
  };
}, [preview]);

  const words = form.content.trim().split(/\s+/).filter(Boolean).length;

  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div>
              <h1 className="text-5xl font-black text-white">
                Create New Story
              </h1>

              <p className="text-slate-400 mt-3">
                Share your knowledge with the world.
              </p>
            </div>

            {/* TITLE */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <input
                placeholder="Your Amazing Title..."
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,

                    title: e.target.value,
                  })
                }
                className="
w-full
bg-transparent
text-white
text-5xl
font-black
outline-none
placeholder:text-slate-600
"
              />
            </div>

            {/* CATEGORY */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <label className="flex items-center gap-2 mb-4 text-slate-300">
                <Hash size={18} />
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
bg-black
border
border-slate-700
rounded-xl
px-5
py-3
outline-none
"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-slate-900 text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* CONTENT */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <div className="flex justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText />

                  <span>Story</span>
                </div>

                <div className="flex gap-6 text-slate-400">
                  <span>{words} words</span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {readingTime} min
                  </span>
                </div>
              </div>

              <textarea
                rows={16}
                value={form.content}
                placeholder="Start writing..."
                onChange={(e) =>
                  setForm({
                    ...form,

                    content: e.target.value,
                  })
                }
                className="
w-full
bg-transparent
text-white
outline-none
resize-none
leading-9
text-lg
placeholder:text-slate-600
"
              />
            </div>

            {/* COVER IMAGE */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <div className="flex items-center gap-3 mb-6">
                <ImagePlus className="text-emerald-400" />

                <h3 className="text-xl font-semibold">Cover Image</h3>
              </div>

              <label
                className="
      flex
      flex-col
      items-center
      justify-center
      border-2
      border-dashed
      border-slate-700
      rounded-3xl
      p-12
      cursor-pointer
      hover:border-emerald-500
      hover:bg-slate-800/40
      transition
    "
              >
                <UploadCloud size={55} className="text-emerald-400 mb-5" />

                <h3 className="text-xl font-semibold">Drag & Drop Image</h3>

                <p className="text-slate-400 mt-2">or click to browse</p>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files[0];

                    if (!selected) return;

                    if (selected.size > 2 * 1024 * 1024) {
                      setError("Image size should be less than 2MB");
                      toast.error("Image too large");
                      return;
                    }

                    setError("");
                    setFile(selected);
                    setPreview(URL.createObjectURL(selected));
                  }}
                />
              </label>

              {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>

            {preview && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                <h3 className="text-xl font-semibold mb-6">Preview</h3>

                <div className="relative group overflow-hidden rounded-3xl">
                  <img
                    src={preview}
                    alt="preview"
                    className="
        w-full
        h-[420px]
        object-cover
        duration-500
        group-hover:scale-105
      "
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                    }}
                    className="
        absolute
        top-5
        right-5
        bg-red-500
        px-4
        py-2  
        rounded-full
        text-white
        hover:bg-red-600
      "
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* PUBLISH PANEL */}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Stats */}

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                <h3 className="text-2xl font-bold mb-6">Story Stats</h3>

                <div className="space-y-5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Words</span>

                    <span className="font-semibold">{words}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Reading Time</span>

                    <span className="font-semibold">{readingTime} min</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Category</span>

                    <span className="font-semibold">{category}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Cover Image</span>

                    <span className="font-semibold">
                      {file ? "Uploaded ✅" : "Not Selected"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Publish */}

              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-black p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Publish?</h3>

                  <p className="text-slate-400 leading-8">
                    Your story will be visible to everyone after publishing.
                  </p>
                </div>

                <div className="space-y-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="
        w-full
        py-4
        rounded-2xl
        font-bold
        text-lg
        bg-gradient-to-r
        from-emerald-500
        via-cyan-500
        to-blue-500
        text-black
        hover:scale-[1.02]
        transition
        disabled:opacity-50
        "
                  >
                    {loading ? "Publishing..." : "🚀 Publish Story"}
                  </button>

                  <button
                    type="button"
                    onClick={() => toast("Draft feature coming soon.")}
                    className="
        w-full
        py-4
        rounded-2xl
        border
        border-slate-700
        hover:border-cyan-500
        transition
        "
                  >
                    Save Draft
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
}

export default CreateBlog;
