import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Plus, Search, Heart, FileText, TrendingUp } from "lucide-react";

import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBlogs = async () => {
    const { data } = await API.get("/blogs/my");
    setBlogs(data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    await API.delete(`/blogs/${id}`);
    fetchBlogs();
  };

  const totalLikes = useMemo(() => {
    return blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
  }, [blogs]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
            <div>
              <h1 className="text-5xl font-black text-white">Dashboard</h1>

              <p className="text-slate-400 mt-3">
                Manage all your published stories.
              </p>
            </div>

            <Link
              to="/create"
              className="
flex
items-center
gap-3
bg-gradient-to-r
from-emerald-500
to-cyan-500
text-black
font-bold
px-6
py-4
rounded-2xl
hover:scale-105
transition
"
            >
              <Plus size={20} />
              New Story
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-7">
            <FileText className="text-cyan-400" />

            <h2 className="text-4xl font-black mt-4">{blogs.length}</h2>

            <p className="text-slate-400 mt-2">Total Blogs</p>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-7">
            <Heart className="text-red-400" />

            <h2 className="text-4xl font-black mt-4">{totalLikes}</h2>

            <p className="text-slate-400 mt-2">Total Likes</p>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-7">
            <TrendingUp className="text-green-400" />

            <h2 className="text-4xl font-black mt-4">
              {blogs.length === 0 ? 0 : Math.round(totalLikes / blogs.length)}
            </h2>

            <p className="text-slate-400 mt-2">Avg Likes</p>
          </div>
        </div>

        <div className="relative mb-10">
          <Search size={20} className="absolute left-5 top-4 text-slate-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your stories..."
            className="
w-full
pl-14
py-4
rounded-2xl
bg-slate-900
border
border-slate-800
outline-none
focus:border-cyan-500
"
          />
        </div>

        {filteredBlogs.length === 0 ? (

<div className="text-center py-24">

    <FileText
        size={70}
        className="mx-auto text-slate-700 mb-6"
    />

    <h2 className="text-3xl font-bold mb-4">

        No Blogs Found

    </h2>

    <p className="text-slate-400">

        Start writing your first story.

    </p>

    <Link
        to="/create"
        className="
        inline-flex
        items-center
        gap-3
        mt-8
        px-6
        py-4
        rounded-2xl
        bg-gradient-to-r
        from-emerald-500
        to-cyan-500
        text-black
        font-bold
        hover:scale-105
        transition
        "
    >
        <Plus size={20}/>
        Create Story
    </Link>

</div>

) : (

<div className="grid lg:grid-cols-2 gap-8">

{filteredBlogs.map((blog,index)=>(

<motion.div

key={blog._id}

initial={{opacity:0,y:30}}

animate={{opacity:1,y:0}}

transition={{
delay:index*0.08
}}

whileHover={{
y:-8
}}

className="
rounded-3xl
overflow-hidden
bg-slate-900
border
border-slate-800
hover:border-cyan-500
transition
"

>

{/* IMAGE */}

<div className="relative">

<img

src={
blog.image ||
"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200"
}

alt={blog.title}

className="
w-full
h-60
object-cover
"

/>

<div
className="
absolute
top-5
left-5
bg-black/70
backdrop-blur-md
px-4
py-2
rounded-full
text-sm
"
>

{blog.category || "Technology"}

</div>

</div>

{/* CONTENT */}

<div className="p-7">

<h2 className="text-2xl font-bold mb-3">

{blog.title}

</h2>

<p className="text-slate-400 leading-7">

{blog.content.slice(0,120)}...

</p>

<div className="flex items-center justify-between mt-8">

<div className="flex items-center gap-5">

<div className="flex items-center gap-2 text-red-400">

<Heart size={18}/>

{blog.likes?.length || 0}

</div>

<div className="text-slate-500 text-sm">

{new Date(blog.createdAt).toLocaleDateString()}

</div>

</div>

<div className="flex gap-3">

<Link

to={`/edit/${blog._id}`}

className="
px-5
py-2
rounded-xl
bg-cyan-500
text-black
font-semibold
hover:scale-105
transition
"

>

Edit

</Link>

<button

onClick={()=>deleteBlog(blog._id)}

className="
px-5
py-2
rounded-xl
bg-red-500
hover:bg-red-600
transition
"

>

Delete

</button>

</div>

</div>

</div>

</motion.div>

))}

</div>

)}
      </div>
    </>
  );
}

export default Dashboard;
