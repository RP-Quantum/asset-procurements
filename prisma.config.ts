import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.NUXT_DATABASE_URL;

export default defineConfig({
	schema: "./prisma",
	migrations: {
		path: "./prisma/migrations",
	},
	datasource: {
		url: databaseUrl,
	},
});
