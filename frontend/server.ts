import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { router as apiRouter } from "../backend/src/index.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount the backend API router
app.use("/api", apiRouter as any);

// Configure Vite middleware or static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully at http://localhost:${PORT}`);
  });
}

startServer();
