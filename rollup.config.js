import typescript from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import styles from "rollup-plugin-styles";
import { injectVueDemi } from "./scripts/rollup";

/** @type {import('rollup').RollupOptions[]} */
const options = [
  {
    input: "src/index.ts",
    plugins: [
      typescript({
        tsconfig: resolvedConfig => ({ ...resolvedConfig, declaration: true }),
        hook: {
          outputPath: (path, kind) =>
            kind === "declaration" ? "dist/index.d.ts" : path
        }
      }),
      styles()
    ],
    external: ["vue-demi", "echarts/core", "resize-detector"],
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript(), styles()],
    external: ["vue-demi", "echarts/core", "resize-detector"],
    output: [
      {
        file: "dist/index.esm.min.js",
        format: "esm",
        sourcemap: true,
        plugins: [
          terser({
            format: {
              comments: false
            }
          })
        ]
      },
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        exports: "named",
        sourcemap: true
      },
      {
        file: "dist/index.cjs.min.js",
        format: "cjs",
        exports: "named",
        sourcemap: true,
        plugins: [
          terser({
            format: {
              comments: false
            }
          })
        ]
      }
    ]
  },
  {
    input: "src/global.ts",
    plugins: [resolve(), typescript(), styles()],
    external: ["vue-demi", "echarts", "echarts/core"],
    output: [
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "VueECharts",
        exports: "default",
        sourcemap: true,
        globals: {
          "vue-demi": "VueDemi",
          echarts: "echarts",
          "echarts/core": "echarts"
        },
        plugins: [injectVueDemi]
      },
      {
        file: "dist/index.umd.min.js",
        format: "umd",
        name: "VueECharts",
        exports: "default",
        sourcemap: true,
        globals: {
          "vue-demi": "VueDemi",
          echarts: "echarts",
          "echarts/core": "echarts"
        },
        plugins: [
          injectVueDemi,
          terser({
            format: {
              comments: false
            }
          })
        ]
      }
    ]
  }
];

export default options;
