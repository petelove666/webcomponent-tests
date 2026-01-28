import esbuild from "esbuild";
import { glob } from "glob";

const staticEntries = [
  "./components/index-esm.js",
  "./theme/theme.css",
  "./styles/global.css",
  "./components/client-side/oc-input-extend/style.css",
];

const componentFiles = await glob("./components/**/*.js");

const allEntries = [...staticEntries, ...componentFiles];

esbuild
  .build({
    entryPoints: allEntries,
    bundle: true,
    format: "esm",
    outdir: "dist",
  })
  .catch(() => process.exit(1));