/**
 * Ensures browser globals like `self` exist before running `next build`
 * to prevent third-party packages from crashing during SSR bundling.
 */

if (typeof globalThis.self === "undefined") {
  globalThis.self = globalThis;
}

const { spawn } = require("child_process");
const path = require("path");

const isWindows = process.platform === "win32";
const command = isWindows ? "npx.cmd" : "npx";
const args = ["next", "build"];
const polyfillPath = path.resolve(__dirname, "self-polyfill.js").replace(/\\/g, "/");
const existingNodeOptions = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : "";
const nodeOptions = `${existingNodeOptions}--require ${polyfillPath}`;

const child = spawn(command, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
  },
  shell: isWindows,
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});

