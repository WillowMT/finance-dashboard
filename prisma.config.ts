import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  datasource: {
    url: process.env.TURSO_DATABASE_URL ?? "file:./dev.db",
  },
});
