import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import testRoutes from "./src/routes/test.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import repositoryRoutes from "./src/routes/repository.routes.js";
import memberRoutes from "./src/routes/member.routes.js";
import blogRoutes from "./src/routes/blog.routes.js";
import blogVersionRoutes from "./src/routes/blog-version.routes.js";
import publicBlogRoutes from "./src/routes/public-blog.routes.js";
import invitationRoutes from "./src/routes/invitation.routes.js";
import followRoutes from "./src/routes/follow.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NintrixBlog API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

const allowedOrigins = [
  "https://nintrix-blog.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/repositories", memberRoutes);
app.use("/api/repositories", blogRoutes);
app.use("/api/repositories", blogVersionRoutes);
app.use("/api/public", publicBlogRoutes);
app.use("/api", invitationRoutes);
app.use("/api/users", followRoutes);

export default app;
