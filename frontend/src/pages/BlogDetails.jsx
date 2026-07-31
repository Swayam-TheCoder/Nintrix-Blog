import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Heart,
  Bookmark,
  Share2,
  Calendar,
  Clock3,
  Eye,
  Send,
  MessageCircle,
  ArrowUp,
  Link2,
} from "lucide-react";

import API from "../services/api";
import Navbar from "../components/Navbar";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [visibleComments, setVisibleComments] = useState(5);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    API.get(`/blogs/${id}`).then((res) => {
      setBlog(res.data);
    });

    API.get(`/comments/${id}`).then((res) => setComments(res.data));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const current = window.scrollY;

      const percentage = (current / totalHeight) * 100;

      setProgress(percentage);

      setShowTop(current > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addComment = async () => {
    await API.post(`/comments/${id}`, { text });
    const res = await API.get(`/comments/${id}`);
    setComments(res.data);
    setText("");
  };

  const likeBlog = async (id) => {
    await API.put(`/blogs/like/${id}`);

    // refresh blogs
    const res = await API.get(`/blogs/${id}`);
    setBlog(res.data);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);

    toast.success("Blog link copied.");
  };

  return (
    <>
      <Navbar />
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r
  from-emerald-400
  via-cyan-400
  to-blue-500
  z-[999]"
        style={{
          width: `${progress}%`,
        }}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero */}

        <div className="relative">
          {blog.image && (
            <div className="h-[520px] overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto px-6 pb-14"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold">
                Technology
              </span>

              <h1 className="text-5xl md:text-7xl font-black mt-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap gap-8 mt-8 text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />

                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "--"}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={18} />5 min read
                </div>

                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  1.2K Views
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}

        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Action Buttons */}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <button
              onClick={() => likeBlog(blog._id)}
              className="flex items-center gap-3 rounded-full border border-slate-700 px-6 py-3 hover:border-red-500 hover:text-red-400 transition"
            >
              <Heart />

              {blog.likes?.length || 0}
            </button>

            <button className="flex items-center gap-3 rounded-full border border-slate-700 px-6 py-3 hover:border-emerald-400 transition">
              <Bookmark />
              Save
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    url: window.location.href,
                  });
                } else {
                  copyLink();
                }
              }}
              className="flex items-center gap-3 rounded-full border border-slate-700 px-6 py-3 hover:border-cyan-400 transition"
            >
              <Share2 />
              Share
            </button>
          </motion.div>

          {/* Author */}

          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl font-bold">
              {blog.author?.name?.charAt(0)?.toUpperCase() ||
                blog.user?.email?.charAt(0)?.toUpperCase() ||
                "A"}
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                {blog.author?.name || blog.user?.email || "Anonymous"}
              </h3>

              <p className="text-slate-400">Full Stack Developer • Writer</p>
            </div>
          </div>

          {/* Blog Content */}

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-10"
          >
            <div
              className="
            prose
            prose-invert
            prose-lg
            max-w-none

            prose-headings:text-white
            prose-p:text-slate-300
            prose-p:leading-9
            prose-strong:text-white
            prose-a:text-emerald-400
            "
            >
              <p style={{ whiteSpace: "pre-wrap" }}>{blog.content}</p>
            </div>
          </motion.article>
        </div>

        {/* COMMENTS */}

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-6 pb-24"
        >
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="text-emerald-400" />

            <h2 className="text-3xl font-bold">Comments</h2>

            <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-sm font-semibold">
              {comments.length}
            </span>
          </div>

          {/* Add Comment */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 mb-10">
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              className="
      w-full
      resize-none
      rounded-2xl
      border
      border-slate-700
      bg-black
      p-5
      outline-none
      focus:border-emerald-500
      "
            />

            <div className="flex justify-end mt-5">
              <button
                onClick={addComment}
                disabled={!text.trim()}
                className="
        flex
        items-center
        gap-2
        rounded-full
        bg-gradient-to-r
        from-emerald-500
        to-cyan-500
        px-7
        py-3
        font-semibold
        text-black
        hover:scale-105
        transition
        disabled:opacity-50
        disabled:hover:scale-100
        "
              >
                <Send size={18} />
                Post Comment
              </button>
            </div>
          </div>

          {/* Comment List */}

          <div className="space-y-6">
            {comments.slice(0, visibleComments).map((c, index) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="
        rounded-3xl
        border
        border-slate-800
        bg-gradient-to-b
        from-slate-900
        to-black
        p-6
        hover:border-emerald-500/40
        transition
        "
              >
                <div className="flex gap-5">
                  {/* Avatar */}

                  <div
                    className="
            w-14
            h-14
            rounded-full
            bg-gradient-to-r
            from-emerald-500
            to-cyan-500
            flex
            items-center
            justify-center
            text-xl
            font-bold
            text-black
            "
                  >
                    {c.user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {c.user?.email || "Anonymous"}
                        </h4>

                        <p className="text-slate-500 text-sm">
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <button
                        className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-slate-700
                px-4
                py-2
                hover:border-red-500
                hover:text-red-400
                transition
                "
                      >
                        <Heart size={16} />
                        Like
                      </button>
                    </div>

                    <p
                      className="
              mt-5
              text-slate-300
              leading-8
              whitespace-pre-wrap
              "
                    >
                      {c.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}

          {comments.length > 5 && (
            <div className="flex justify-center mt-10">
              {visibleComments < comments.length ? (
                <button
                  onClick={() => setVisibleComments((prev) => prev + 5)}
                  className="
          rounded-full
          border
          border-emerald-500
          px-8
          py-3
          hover:bg-emerald-500
          hover:text-black
          transition
          "
                >
                  Load More Comments
                </button>
              ) : (
                <button
                  onClick={() => setVisibleComments(5)}
                  className="
          rounded-full
          border
          border-red-500
          px-8
          py-3
          hover:bg-red-500
          transition
          "
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </motion.section>

        <div className="fixed right-8 bottom-32 flex flex-col gap-4 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyLink}
            className="
    w-14
    h-14
    rounded-full
    bg-slate-900
    border
    border-slate-700
    flex
    items-center
    justify-center
    hover:border-cyan-400
    transition
    "
          >
            <Link2 />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              navigator.share &&
              navigator.share({
                title: blog.title,
                url: window.location.href,
              })
            }
            className="
    w-14
    h-14
    rounded-full
    bg-slate-900
    border
    border-slate-700
    flex
    items-center
    justify-center
    hover:border-emerald-400
    transition
    "
          >
            <Share2 />
          </motion.button>
        </div>

        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="
fixed
right-8
bottom-10
w-14
h-14
rounded-full
bg-emerald-500
text-black
shadow-2xl
flex
items-center
justify-center
z-50
"
          >
            <ArrowUp />
          </motion.button>
        )}
      </div>
    </>
  );
}

export default BlogDetails;
