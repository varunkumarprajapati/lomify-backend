import path from "node:path";

const ROOT = path.join(process.cwd());
const TEMPLATE_DIR = path.join(ROOT, "assets/templates");
const MIGRATIONS_DIR = path.join(ROOT, "assets/migrations");

export { ROOT, TEMPLATE_DIR, MIGRATIONS_DIR };
