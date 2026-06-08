const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function parseJsonc(relativePath) {
  const source = read(relativePath)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
  return JSON.parse(source);
}

function collectHexValues(value, output = []) {
  if (typeof value === "string" && /^#[0-9A-Fa-f]{3,8}$/.test(value)) {
    output.push(value.toUpperCase());
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectHexValues(item, output));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectHexValues(item, output));
  }
  return output;
}

function validatePackage() {
  const pkg = parseJson("package.json");
  assert(pkg.name === "lauds", "package name must be lauds");
  assert(pkg.displayName === "Lauds", "displayName must be Lauds");
  assert(pkg.contributes.themes.length === 1, "one VS Code theme must be contributed");
  const theme = pkg.contributes.themes[0];
  assert(theme.label === "Lauds", "theme label must be Lauds");
  assert(theme.uiTheme === "vs", "theme must declare light VS Code uiTheme vs");
  assert(theme.path === "./themes/lauds-light-color-theme.json", "theme path must point to lauds light theme");
}

function validateVsCodeTheme() {
  const theme = parseJsonc("themes/lauds-light-color-theme.json");
  assert(theme.name === "Lauds", "VS Code theme name must be Lauds");
  assert(theme.colors["editor.background"].toUpperCase() === "#FFFCF0", "editor background must use Flexoki paper");
  assert(theme.colors["editor.foreground"].toUpperCase() === "#282726", "editor foreground must use warm ink");
  assert(theme.colors["button.background"].toUpperCase() === "#B85C20", "button background must use Lauds orange");
  assert(Array.isArray(theme.tokenColors), "tokenColors must be an array");
  assert(
    theme.tokenColors.some((entry) => entry.name === "String" && entry.settings.foreground.toUpperCase() === "#1F8F7A"),
    "strings must use Lauds mint",
  );
  assert(
    theme.tokenColors.some((entry) => entry.name === "Function" && entry.settings.foreground.toUpperCase() === "#B85C20"),
    "functions must use Lauds orange",
  );
  assert(
    theme.tokenColors.some((entry) => entry.name === "Comment" && entry.settings.foreground.toUpperCase() === "#878580"),
    "comments must use muted ink",
  );
}

function validateNeovimFiles() {
  const palette = read("lua/lauds/palette.lua");
  ["bg", "bg_alt", "bg_raised", "border", "fg", "fg_muted", "comment", "orange", "orange_soft", "mint", "mint_soft", "red", "red_soft"].forEach((key) => {
    assert(palette.includes(`${key} =`), `palette must define ${key}`);
  });
  const init = read("lua/lauds/init.lua");
  assert(init.includes("function M.setup"), "init.lua must expose setup");
  assert(init.includes("function M.colorscheme"), "init.lua must expose colorscheme");
  const theme = read("lua/lauds/theme.lua");
  assert(theme.includes("@string"), "theme.lua must define Treesitter strings");
  assert(theme.includes("@function"), "theme.lua must define Treesitter functions");
  assert(theme.includes("DiagnosticError"), "theme.lua must define diagnostics");
  assert(read("colors/lauds.lua").includes("require(\"lauds\").colorscheme()"), "colors/lauds.lua must load the colorscheme");
}

function validatePaletteUse() {
  const theme = parseJsonc("themes/lauds-light-color-theme.json");
  const values = new Set(collectHexValues(theme));
  ["#FFFCF0", "#282726", "#B85C20", "#1F8F7A", "#AF3029"].forEach((hex) => {
    assert(values.has(hex), `VS Code theme must use ${hex}`);
  });
}

function validatePywalScheme() {
  const scheme = parseJson("variants/pywal/lauds.json");
  assert(scheme.refer === "https://github.com/ntk148v/lauds", "pywal scheme must refer to Lauds");
  assert(scheme.special.background.toUpperCase() === "#FFFCF0", "pywal background must use Flexoki paper");
  assert(scheme.special.foreground.toUpperCase() === "#282726", "pywal foreground must use Lauds ink");
  assert(scheme.special.cursor.toUpperCase() === "#B85C20", "pywal cursor must use Lauds orange");

  for (let index = 0; index <= 15; index += 1) {
    const key = `color${index}`;
    assert(/^#[0-9A-Fa-f]{6}$/.test(scheme.colors[key]), `pywal ${key} must be a hex color`);
  }

  assert(scheme.colors.color1.toUpperCase() === "#AF3029", "pywal red must use Lauds red");
  assert(scheme.colors.color3.toUpperCase() === "#B85C20", "pywal yellow slot must use Lauds orange");
  assert(scheme.colors.color6.toUpperCase() === "#1F8F7A", "pywal cyan slot must use Lauds mint");
  assert(scheme.colors.color7.toUpperCase() === "#F2F0E5", "pywal light foreground slot must use Lauds raised paper");
}

function validateNeovimRuntime() {
  const result = spawnSync("nvim", ["--headless", "-u", "NONE", "-i", "NONE", "-c", "set rtp^=.", "-c", "lua require('lauds').setup()", "-c", "colorscheme lauds", "-c", "qa"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      NVIM_LOG_FILE: "/tmp/lauds-nvim.log",
    },
  });
  if (result.error && result.error.code === "ENOENT") {
    console.warn("nvim not found; skipped Neovim runtime validation");
    return;
  }
  assert(result.status === 0, `Neovim runtime validation failed:\n${result.stderr || result.stdout}`);
  assert(!/Error/i.test(result.stderr), `Neovim runtime validation wrote an error:\n${result.stderr}`);
}

validatePackage();
validateVsCodeTheme();
validateNeovimFiles();
validatePaletteUse();
validatePywalScheme();
validateNeovimRuntime();
console.log("Lauds validation passed");
