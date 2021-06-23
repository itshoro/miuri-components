import typescript from "rollup-plugin-typescript2";
import del from "rollup-plugin-delete";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "playground/components/miuri/index.js",
        format: "esm",
        banner: "/* eslint-disable */",
      },
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "esm" },
    ],
    plugins: [
      del({ targets: ["dist/*", "playground/components/miuri"] }),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
    external: Object.keys(pkg.peerDependencies || {}).concat([
      "next/router",
      "next/link",
    ]),
  },
];
