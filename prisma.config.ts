import { defineConfig } from "@prisma/config";
import { config } from "dotenv";

// Memaksa memuat variabel dari .env dan .env.local
config();
config({ path: ".env.local" });

export default defineConfig({
  datasource: {
    // Prisma CLI (migrate/db push/dll) butuh koneksi LANGSUNG ke database,
    // bukan URL Accelerate/pooled. "migrate.directUrl" sudah dihapus di
    // Prisma 7 — nilainya sekarang taruh langsung di "datasource.url".
    url: process.env.DATABASE_PROPOINT_POSTGRES_URL!,
  },
});
