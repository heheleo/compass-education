import { defineConfig, type Options } from "tsup";
import { dependencies } from "./package.json";

const baseOptions: Options = {
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    minify: true,
    external: Object.keys(dependencies),
    sourcemap: true,
    target: "es2020",
    tsconfig: "tsconfig.json",
    treeshake: true,
};

export default [
    defineConfig({
        ...baseOptions,
        outDir: "dist/cjs",
        format: "cjs",
        outExtension: () => ({ js: ".cjs" }),
    }),
    defineConfig({
        ...baseOptions,
        outDir: "dist/esm",
        format: "esm",
        outExtension: () => ({ js: ".mjs" }),
    }),
];
