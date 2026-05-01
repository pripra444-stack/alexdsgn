import express from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(join(__dirname, "../dist")));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () =>
  console.log(`\n  Portfolio: http://localhost:${PORT}\n`)
);
