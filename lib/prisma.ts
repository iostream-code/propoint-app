import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7: PrismaClient tidak lagi menerima "datasources" ataupun
// "datasourceUrl" seperti versi lama. Sekarang WAJIB memilih salah satu:
//  - accelerateUrl  -> kalau URL berupa "prisma+postgres://..." (Prisma Postgres/Accelerate)
//  - adapter        -> kalau URL berupa "postgresql://..." / "postgres://..." biasa
const connectionString = process.env.DATABASE_PROPOINT_PRISMA_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_PROPOINT_PRISMA_DATABASE_URL belum diset di .env / .env.local",
  );
}

/**
 * pg-connection-string v3 akan mengubah arti sslmode 'prefer' / 'require' /
 * 'verify-ca' agar setara 'verify-full'. Selama itu belum terjadi, pg masih
 * memunculkan warning setiap request. Kita eksplisitkan sslmode + minta
 * kompatibilitas mode lama (uselibpqcompat) supaya perilaku tetap sama
 * seperti sekarang, tapi tanpa warning di console.
 */
function silenceSslModeWarning(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    const sslmode = url.searchParams.get("sslmode");

    if (!sslmode || ["prefer", "require", "verify-ca"].includes(sslmode)) {
      url.searchParams.set("sslmode", sslmode ?? "require");
      url.searchParams.set("uselibpqcompat", "true");
    }

    return url.toString();
  } catch {
    // Bukan format URL standar (jarang terjadi) -> biarkan apa adanya.
    return rawUrl;
  }
}

const prismaClientSingleton = () => {
  if (connectionString.startsWith("prisma+postgres://")) {
    // Prisma Postgres / Prisma Accelerate
    return new PrismaClient({ accelerateUrl: connectionString });
  }

  // Koneksi PostgreSQL langsung via driver adapter
  const adapter = new PrismaPg({
    connectionString: silenceSslModeWarning(connectionString),
  });
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
