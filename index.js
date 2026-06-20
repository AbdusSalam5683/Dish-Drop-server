import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

async function startServer() {
  // 1. Connect to MongoDB FIRST (auth.js needs getDB() to already work)
  await connectDB();

  // 2. Import auth AFTER DB is connected
  const { auth } = await import("./lib/auth.js");

  // 3. CORS — must allow credentials for cookies to work cross-origin
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    })
  );

  // 4. Mount Better Auth handler BEFORE express.json()
  //    (Express v5 uses "/api/auth/*splat", Express v4 uses "/api/auth/*")
  app.all("/api/auth/*splat", toNodeHandler(auth));

  // 5. Now safe to use express.json() for the rest of your routes
  app.use(express.json());

  // ── Your other API routes go here ────────────────────────────────────────
  // app.use("/api/recipes", recipeRoutes);
  // app.use("/api/users", userRoutes);
  // app.use("/api/payments", paymentRoutes);

  app.get("/", (req, res) => {
    res.send("🍽️ DishDrop server is running");
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// index.js