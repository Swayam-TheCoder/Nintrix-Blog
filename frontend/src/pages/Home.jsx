import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import HeroCanvas from "../components/HeroCanvas";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ArrowRight,
  Calendar,
  Clock3,
  Eye,
  MessageCircle,
} from "lucide-react";

import { Search, TrendingUp, Sparkles } from "lucide-react";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/blogs?search=${search}&sort=${sort}&page=${page}`,
      );

      setBlogs(data.blogs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchBlogs, 250);

    return () => clearTimeout(timer);
  }, [search, sort, page]);

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden min-h-[90vh] bg-black">
        <HeroCanvas />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="min-h-[90vh] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-emerald-400 mb-8">
                <Sparkles size={18} />
                Premium Blogging Platform
              </div>

              <h1 className="text-6xl md:text-7xl font-black leading-tight text-white">
                Share
                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Your Stories
                </span>
              </h1>

              <p className="mt-8 text-lg text-slate-300 leading-8 max-w-2xl">
                Publish beautiful articles, inspire thousands of readers, and
                build your personal brand with a modern blogging platform.
              </p>

              <div className="mt-12 flex flex-wrap gap-4">
                <button className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 font-semibold hover:scale-105 transition">
                  Start Writing
                </button>

                <button className="rounded-full border border-slate-700 bg-slate-900/70 px-8 py-4 hover:border-emerald-400 transition">
                  Explore Blogs
                </button>
              </div>

              <div className="mt-16">
                <div className="flex items-center bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
                  <Search className="ml-5 text-slate-400" size={22} />

                  <input
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent p-5 outline-none text-white"
                  />

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-slate-800 text-white h-full px-5 outline-none"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <div className="rounded-full bg-slate-900 px-5 py-2 border border-slate-700">
                  React
                </div>

                <div className="rounded-full bg-slate-900 px-5 py-2 border border-slate-700">
                  NodeJS
                </div>

                <div className="rounded-full bg-slate-900 px-5 py-2 border border-slate-700">
                  MongoDB
                </div>

                <div className="rounded-full bg-slate-900 px-5 py-2 border border-slate-700">
                  JavaScript
                </div>

                <div className="rounded-full bg-slate-900 px-5 py-2 border border-slate-700 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Trending
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-5xl font-bold text-white">Latest Blogs</h2>

              <p className="text-slate-400 mt-3">
                Discover stories from developers and creators.
              </p>
            </div>

            <button
              className="
        rounded-full
        border
        border-slate-700
        px-6
        py-3
        hover:border-emerald-400
        transition
        "
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="
            rounded-3xl
            bg-slate-900
            overflow-hidden
            animate-pulse
            "
                >
                  <div className="h-56 bg-slate-800" />

                  <div className="p-6">
                    <div className="h-6 bg-slate-800 rounded w-2/3 mb-5" />

                    <div className="h-4 bg-slate-800 rounded mb-2" />

                    <div className="h-4 bg-slate-800 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                  }}
                  className="
            group
            overflow-hidden
            rounded-3xl
            border
            border-slate-800
            bg-gradient-to-b
            from-slate-900
            to-black
            shadow-xl
            "
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        blog.image ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643"
                      }
                      alt={blog.title}
                      className="
                h-60
                w-full
                object-cover
                duration-500
                group-hover:scale-110
                "
                    />

                    <div
                      className="
                absolute
                top-4
                left-4
                rounded-full
                bg-emerald-500
                px-4
                py-1
                text-sm
                font-semibold
                text-black
                "
                    >
                      Technology
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-5 text-slate-400 text-sm mb-5">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} />

                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 size={16} />5 min
                      </span>
                    </div>

                    <h2
                      className="
                text-2xl
                font-bold
                text-white
                group-hover:text-emerald-400
                transition
                "
                    >
                      {blog.title}
                    </h2>

                    <p className="mt-4 text-slate-400 leading-7">
                      {blog.content.slice(0, 120)}...
                    </p>

                    <div className="mt-8 flex justify-between items-center">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => likeBlog(blog._id)}
                          className="
                    flex
                    items-center
                    gap-2
                    text-slate-300
                    hover:text-red-400
                    transition
                    "
                        >
                          <Heart size={18} />

                          {blog.likes?.length || 0}
                        </button>

                        <div
                          className="
                    flex
                    items-center
                    gap-2
                    text-slate-300
                    "
                        >
                          <MessageCircle size={18} />
                          12
                        </div>

                        <div
                          className="
                    flex
                    items-center
                    gap-2
                    text-slate-300
                    "
                        >
                          <Eye size={18} />
                          1.2k
                        </div>
                      </div>

                      <Link
                        to={`/blog/${blog._id}`}
                        className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-emerald-500
                  px-5
                  py-2
                  text-black
                  font-semibold
                  hover:bg-emerald-400
                  transition
                  "
                      >
                        Read
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <div className="text-center py-24">
              <h3 className="text-4xl font-bold text-white">No Blogs Found</h3>

              <p className="text-slate-400 mt-4">Try another search keyword.</p>
            </div>
          )}
        </div>
      </section>
      <section className="bg-[#020617] py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", title: "Readers" },
              { number: "1200+", title: "Blogs" },
              { number: "350+", title: "Authors" },
              { number: "99%", title: "Satisfaction" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-10"
              >
                <h2 className="text-5xl font-black text-emerald-400">
                  {item.number}
                </h2>

                <p className="text-slate-400 mt-3">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-12">
            Explore Categories
          </h2>

          <div className="flex flex-wrap gap-5">
            {[
              "React",
              "Node.js",
              "MongoDB",
              "Java",
              "AI",
              "Machine Learning",
              "System Design",
              "Security",
              "Cloud",
              "DevOps",
              "Career",
              "Open Source",
            ].map((category) => (
              <button
                key={category}
                className="

px-6

py-3

rounded-full

bg-slate-900

border

border-slate-700

hover:border-emerald-400

hover:bg-slate-800

transition

"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-12">
            Explore Categories
          </h2>

          <div className="flex flex-wrap gap-5">
            {[
              "React",
              "Node.js",
              "MongoDB",
              "Java",
              "AI",
              "Machine Learning",
              "System Design",
              "Security",
              "Cloud",
              "DevOps",
              "Career",
              "Open Source",
            ].map((category) => (
              <button
                key={category}
                className="

px-6

py-3

rounded-full

bg-slate-900

border

border-slate-700

hover:border-emerald-400

hover:bg-slate-800

transition

"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-28 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-black text-white">Stay Updated</h2>

          <p className="text-slate-400 mt-5 text-lg">
            Get the latest blogs delivered directly to your inbox.
          </p>

          <div className="mt-12 flex flex-col md:flex-row gap-5">
            <input
              placeholder="Enter your email"
              className="

flex-1

bg-slate-900

border

border-slate-700

rounded-2xl

px-6

py-4

outline-none

focus:border-emerald-400

"
            />

            <button
              className="

px-8

rounded-2xl

bg-gradient-to-r

from-emerald-500

to-cyan-500

font-semibold

hover:scale-105

transition

"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                SBlog
              </h2>

              <p className="text-slate-400 mt-4">
                Modern blogging platform for developers, creators and writers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>

              <ul className="space-y-3 text-slate-400">
                <li>Blogs</li>

                <li>Categories</li>

                <li>Trending</li>

                <li>Bookmarks</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>

              <ul className="space-y-3 text-slate-400">
                <li>About</li>

                <li>Contact</li>

                <li>Privacy</li>

                <li>Terms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Social</h3>

              <ul className="space-y-3 text-slate-400">
                <li>GitHub</li>

                <li>LinkedIn</li>

                <li>Twitter</li>

                <li>Discord</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            © 2026 SBlog. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
