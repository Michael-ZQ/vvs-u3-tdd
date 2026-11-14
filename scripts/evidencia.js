// Guarda la salida de Vitest en evidencias/<nombre>.txt para documentar cada fase del ciclo TDD.
// Uso: npm run evidencia -- <nombre> "<descripción>" [--coverage]
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const [nombre, descripcion = "", ...resto] = process.argv.slice(2);
if (!nombre) {
  console.error('Uso: npm run evidencia -- <nombre> "<descripción>" [--coverage]');
  process.exit(2);
}
const args = ["vitest", "run", "--reporter=verbose", ...(resto.includes("--coverage") ? ["--coverage"] : [])];
const run = spawnSync("npx", args, { encoding: "utf8", shell: true, env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" } });
const salida = (run.stdout + run.stderr)
  .replace(/\x1b\[[0-9;]*m/g, "")
  .split(process.cwd() + "\\").join("")
  .split(process.cwd().replaceAll("\\", "/") + "/").join("");
const texto = [
  `# Evidencia: ${nombre} — ${descripcion}`,
  `# Fecha: ${new Date().toLocaleString("sv-SE").slice(0, 16)} (hora local) | Node ${process.version}`,
  `# Comando: npx ${args.join(" ")}`,
  "",
  salida.trim(),
  "",
  `# Código de salida: ${run.status}`,
].join("\n");
writeFileSync(`evidencias/${nombre}.txt`, texto + "\n");
console.log(texto);
