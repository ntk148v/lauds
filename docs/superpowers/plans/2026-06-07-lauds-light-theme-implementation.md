# Lauds Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a light Lauds theme for VS Code and Neovim using Flexoki paper surfaces and Vesper-preserved peppermint/orange sparse syntax.

**Architecture:** This repo contains two hand-authored theme ports that share one palette contract. A small Node validation script checks the VS Code manifest/theme and static Neovim Lua files; Neovim headless verification checks runtime loading when `nvim` is available.

**Tech Stack:** VS Code theme JSONC, Neovim Lua colorscheme, Node.js standard library validation, optional Neovim headless runtime check.

---

## File Structure

- Create `package.json`: VS Code extension metadata and validation script.
- Create `.vscodeignore`: packaged extension exclusions.
- Create `themes/lauds-light-color-theme.json`: VS Code workbench and TextMate theme.
- Create `colors/lauds.lua`: Neovim colorscheme entrypoint.
- Create `lua/lauds/init.lua`: Neovim public setup/colorscheme API.
- Create `lua/lauds/palette.lua`: shared Neovim palette with override support.
- Create `lua/lauds/theme.lua`: Neovim highlight group generation.
- Create `scripts/validate.js`: repository validation harness.
- Create `README.md`: install/use documentation and palette notes.
- Create `LICENSE`: MIT license placeholder-free license text.

## Task 1: Validation Harness And Metadata

**Files:**
- Create: `package.json`
- Create: `scripts/validate.js`
- Create: `.vscodeignore`
- Create: `README.md`
- Create: `LICENSE`

- [ ] **Step 1: Write validation script before theme implementation**

Create `scripts/validate.js` with checks for files that do not exist yet. This must fail until the VS Code and Neovim theme files are added.

```javascript
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
  assert(theme.tokenColors.some((entry) => entry.name === "String" && entry.settings.foreground.toUpperCase() === "#1F8F7A"), "strings must use Lauds mint");
  assert(theme.tokenColors.some((entry) => entry.name === "Function" && entry.settings.foreground.toUpperCase() === "#B85C20"), "functions must use Lauds orange");
  assert(theme.tokenColors.some((entry) => entry.name === "Comment" && entry.settings.foreground.toUpperCase() === "#878580"), "comments must use muted ink");
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

function validateNeovimRuntime() {
  const result = spawnSync("nvim", ["--headless", "-u", "NONE", "-c", "set rtp^=.", "-c", "lua require('lauds').setup()", "-c", "colorscheme lauds", "-c", "qa"], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.error && result.error.code === "ENOENT") {
    console.warn("nvim not found; skipped Neovim runtime validation");
    return;
  }
  assert(result.status === 0, `Neovim runtime validation failed:\n${result.stderr || result.stdout}`);
}

validatePackage();
validateVsCodeTheme();
validateNeovimFiles();
validatePaletteUse();
validateNeovimRuntime();
console.log("Lauds validation passed");
```

- [ ] **Step 2: Create package metadata**

Create `package.json` with:

```json
{
  "name": "lauds",
  "displayName": "Lauds",
  "publisher": "ntk148v",
  "description": "Paper-light Vesper theme with peppermint and orange accents.",
  "license": "MIT",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": [
    "Themes"
  ],
  "scripts": {
    "test": "node scripts/validate.js"
  },
  "contributes": {
    "themes": [
      {
        "label": "Lauds",
        "uiTheme": "vs",
        "path": "./themes/lauds-light-color-theme.json"
      }
    ]
  }
}
```

- [ ] **Step 3: Add extension packaging ignore**

Create `.vscodeignore` with:

```gitignore
.git/**
docs/**
scripts/**
*.vsix
```

- [ ] **Step 4: Add README**

Create `README.md` documenting Lauds as a paper-light Vesper variant, with VS Code and Neovim installation snippets and the palette table from the design spec.

- [ ] **Step 5: Add MIT license**

Create `LICENSE` with MIT license text and copyright holder `kien`.

- [ ] **Step 6: Run validation and verify it fails for missing theme files**

Run: `npm test`

Expected: fail because `themes/lauds-light-color-theme.json` does not exist.

- [ ] **Step 7: Commit metadata and failing validation harness**

Run:

```bash
git add package.json scripts/validate.js .vscodeignore README.md LICENSE docs/superpowers/plans/2026-06-07-lauds-light-theme-implementation.md
git commit -m "chore: add lauds validation harness"
```

## Task 2: VS Code Theme

**Files:**
- Create: `themes/lauds-light-color-theme.json`
- Modify: `README.md`

- [ ] **Step 1: Create VS Code theme JSONC**

Create `themes/lauds-light-color-theme.json` using:

```jsonc
{
  "name": "Lauds",
  "type": "light",
  "colors": {
    "editor.background": "#FFFCF0",
    "editor.foreground": "#282726",
    "editor.selectionBackground": "#F4C7A266",
    "editor.selectionHighlightBackground": "#BFE8D966",
    "editorLineNumber.foreground": "#9F9D96",
    "editorLineNumber.activeForeground": "#575653",
    "editorCursor.foreground": "#B85C20",
    "editorGroupHeader.tabsBackground": "#F2F0E5",
    "editorWidget.background": "#F2F0E5",
    "editorWidget.border": "#DAD8CE",
    "editorWarning.foreground": "#B85C20",
    "editorError.foreground": "#AF3029",
    "editorInfo.foreground": "#1F8F7A",
    "editorOverviewRuler.border": "#DAD8CE",
    "editorGutter.addedBackground": "#1F8F7A",
    "editorGutter.deletedBackground": "#AF3029",
    "editorGutter.modifiedBackground": "#B85C20",
    "diffEditor.insertedTextBackground": "#BFE8D966",
    "diffEditor.insertedLineBackground": "#BFE8D933",
    "diffEditor.removedTextBackground": "#FFCABB66",
    "diffEditor.removedLineBackground": "#FFCABB33",
    "editorInlayHint.foreground": "#6F6E69",
    "editorInlayHint.background": "#F2F0E5",
    "sideBar.background": "#F2F0E5",
    "sideBar.foreground": "#282726",
    "sideBarTitle.foreground": "#6F6E69",
    "sideBarSectionHeader.foreground": "#6F6E69",
    "sideBarSectionHeader.background": "#E6E4D9",
    "activityBar.background": "#F2F0E5",
    "activityBar.foreground": "#575653",
    "activityBar.inactiveForeground": "#878580",
    "activityBarBadge.background": "#B85C20",
    "activityBarBadge.foreground": "#FFFCF0",
    "titleBar.activeBackground": "#F2F0E5",
    "titleBar.inactiveBackground": "#F2F0E5",
    "titleBar.activeForeground": "#575653",
    "titleBar.inactiveForeground": "#878580",
    "tab.border": "#DAD8CE",
    "tab.activeBackground": "#FFFCF0",
    "tab.activeForeground": "#282726",
    "tab.activeBorder": "#B85C20",
    "tab.inactiveBackground": "#F2F0E5",
    "tab.inactiveForeground": "#6F6E69",
    "statusBar.background": "#F2F0E5",
    "statusBar.noFolderBackground": "#F2F0E5",
    "statusBar.foreground": "#6F6E69",
    "statusBar.border": "#DAD8CE",
    "statusBar.debuggingForeground": "#FFFCF0",
    "statusBar.debuggingBackground": "#B85C20",
    "statusBarItem.remoteBackground": "#B85C20",
    "statusBarItem.remoteForeground": "#FFFCF0",
    "list.activeSelectionForeground": "#B85C20",
    "list.activeSelectionBackground": "#E6E4D9",
    "list.inactiveSelectionBackground": "#E6E4D9",
    "list.hoverBackground": "#E6E4D9",
    "list.errorForeground": "#AF3029",
    "list.highlightForeground": "#B85C20",
    "badge.background": "#B85C20",
    "badge.foreground": "#FFFCF0",
    "button.background": "#B85C20",
    "button.hoverBackground": "#9D4310",
    "button.foreground": "#FFFCF0",
    "focusBorder": "#B85C20",
    "icon.foreground": "#6F6E69",
    "input.background": "#F2F0E5",
    "input.foreground": "#282726",
    "input.border": "#DAD8CE",
    "selection.background": "#F4C7A266",
    "editorBracketHighlight.foreground1": "#6F6E69",
    "editorBracketHighlight.foreground2": "#6F6E69",
    "editorBracketHighlight.foreground3": "#6F6E69",
    "editorBracketHighlight.foreground4": "#6F6E69",
    "editorBracketHighlight.foreground5": "#6F6E69",
    "editorBracketHighlight.foreground6": "#6F6E69",
    "editorBracketHighlight.unexpectedBracket.foreground": "#AF3029",
    "textLink.foreground": "#B85C20",
    "textLink.activeForeground": "#9D4310",
    "editorHoverWidget.background": "#F2F0E5",
    "editorHoverWidget.border": "#DAD8CE",
    "scrollbarSlider.background": "#CECDC380",
    "scrollbarSlider.hoverBackground": "#B7B5AC",
    "settings.modifiedItemIndicator": "#B85C20"
  },
  "tokenColors": [
    { "name": "Comment", "scope": ["comment", "punctuation.definition.comment"], "settings": { "fontStyle": "italic", "foreground": "#878580" } },
    { "name": "Variables", "scope": ["variable", "string constant.other.placeholder", "entity.name.tag"], "settings": { "foreground": "#282726" } },
    { "name": "Invalid", "scope": ["invalid", "invalid.illegal"], "settings": { "foreground": "#AF3029" } },
    { "name": "Keyword", "scope": ["keyword", "storage.type", "storage.modifier"], "settings": { "foreground": "#6F6E69" } },
    { "name": "Operator", "scope": ["keyword.control", "keyword.operator", "punctuation", "punctuation.definition.tag", "punctuation.section.embedded"], "settings": { "foreground": "#6F6E69" } },
    { "name": "Tag", "scope": ["entity.name.tag", "meta.tag.sgml", "markup.deleted.git_gutter"], "settings": { "foreground": "#B85C20" } },
    { "name": "Function", "scope": ["entity.name.function", "variable.function", "support.function", "keyword.other.special-method"], "settings": { "foreground": "#B85C20" } },
    { "name": "Number", "scope": ["constant.numeric", "support.constant", "constant.character", "constant.escape", "keyword.other.unit", "keyword.other", "constant.language.boolean"], "settings": { "foreground": "#B85C20" } },
    { "name": "String", "scope": ["string", "constant.other.symbol", "constant.other.key"], "settings": { "foreground": "#1F8F7A" } },
    { "name": "Class", "scope": ["entity.name", "support.type", "support.class", "support.other.namespace", "markup.changed.git_gutter", "support.type.sys-types"], "settings": { "foreground": "#B85C20" } },
    { "name": "CSS Property", "scope": ["source.css support.type.property-name", "source.scss support.type.property-name", "source.less support.type.property-name", "meta.property-name.css"], "settings": { "foreground": "#282726" } },
    { "name": "Language Variable", "scope": ["variable.language"], "settings": { "foreground": "#6F6E69" } },
    { "name": "Attributes", "scope": ["entity.other.attribute-name", "meta.property-list.scss", "meta.attribute-selector.scss", "meta.selector.css"], "settings": { "foreground": "#B85C20" } },
    { "name": "Inserted", "scope": ["markup.inserted"], "settings": { "foreground": "#1F8F7A" } },
    { "name": "Deleted", "scope": ["markup.deleted"], "settings": { "foreground": "#AF3029" } },
    { "name": "Changed", "scope": ["markup.changed"], "settings": { "foreground": "#6F6E69" } },
    { "name": "Regular Expressions", "scope": ["string.regexp"], "settings": { "foreground": "#6F6E69" } },
    { "name": "URL", "scope": ["*url*", "*link*", "*uri*"], "settings": { "fontStyle": "underline" } },
    { "name": "JSON Key", "scope": ["source.json meta.structure.dictionary.json support.type.property-name.json"], "settings": { "foreground": "#B85C20" } },
    { "name": "Markdown Plain", "scope": ["text.html.markdown", "punctuation.definition.list_item.markdown"], "settings": { "foreground": "#282726" } },
    { "name": "Markdown Raw Inline", "scope": ["text.html.markdown markup.inline.raw.markdown"], "settings": { "foreground": "#6F6E69" } },
    { "name": "Markdown Heading", "scope": ["markdown.heading", "markup.heading", "markup.heading.markdown punctuation.definition.heading.markdown"], "settings": { "foreground": "#B85C20" } },
    { "name": "Markup Italic", "scope": ["markup.italic"], "settings": { "fontStyle": "italic", "foreground": "#282726" } },
    { "name": "Markup Bold", "scope": ["markup.bold", "markup.bold string"], "settings": { "fontStyle": "bold", "foreground": "#282726" } },
    { "name": "Markup Underline", "scope": ["markup.underline"], "settings": { "fontStyle": "underline", "foreground": "#B85C20" } },
    { "name": "Markdown Link Description", "scope": ["string.other.link.description.title.markdown"], "settings": { "foreground": "#6F6E69" } },
    { "name": "Markdown Link Anchor", "scope": ["constant.other.reference.link.markdown"], "settings": { "foreground": "#B85C20" } },
    { "name": "Markup Raw Block", "scope": ["markup.raw.block"], "settings": { "foreground": "#6F6E69" } },
    { "name": "Markup Table", "scope": ["markup.table"], "settings": { "foreground": "#282726" } }
  ],
  "semanticHighlighting": true,
  "semanticTokenColors": {
    "function": "#B85C20",
    "method": "#B85C20",
    "string": "#1F8F7A",
    "number": "#B85C20",
    "comment": { "foreground": "#878580", "italic": true },
    "keyword": "#6F6E69",
    "variable": "#282726",
    "property": "#282726",
    "type": "#B85C20"
  }
}
```

- [ ] **Step 2: Run validation and verify it fails for missing Neovim files**

Run: `npm test`

Expected: fail because `lua/lauds/palette.lua` does not exist.

- [ ] **Step 3: Commit VS Code theme**

Run:

```bash
git add themes/lauds-light-color-theme.json README.md
git commit -m "feat: add vscode lauds theme"
```

## Task 3: Neovim Theme

**Files:**
- Create: `colors/lauds.lua`
- Create: `lua/lauds/init.lua`
- Create: `lua/lauds/palette.lua`
- Create: `lua/lauds/theme.lua`
- Modify: `README.md`

- [ ] **Step 1: Create Neovim palette module**

Create `lua/lauds/palette.lua` with palette defaults and override merging.

- [ ] **Step 2: Create Neovim highlight theme module**

Create `lua/lauds/theme.lua` with highlight group generation for core editor groups, diagnostics, Treesitter captures, diff, git signs, Telescope, tree plugins, cmp, which-key, lazy.nvim, bufferline, and lualine export.

- [ ] **Step 3: Create Neovim public API**

Create `lua/lauds/init.lua` exposing `setup`, `colorscheme`, `palette`, `theme`, and `lualine` data.

- [ ] **Step 4: Create colorscheme entrypoint**

Create `colors/lauds.lua` with:

```lua
require("lauds").colorscheme()
```

- [ ] **Step 5: Run validation and verify it passes**

Run: `npm test`

Expected: `Lauds validation passed`

- [ ] **Step 6: Run Neovim headless validation directly if Neovim exists**

Run:

```bash
if command -v nvim >/dev/null 2>&1; then nvim --headless -u NONE -c 'set rtp^=.' -c "lua require('lauds').setup()" -c 'colorscheme lauds' -c 'qa'; fi
```

Expected: exit code 0, or no-op if `nvim` is not installed.

- [ ] **Step 7: Commit Neovim theme**

Run:

```bash
git add colors/lauds.lua lua/lauds/init.lua lua/lauds/palette.lua lua/lauds/theme.lua README.md
git commit -m "feat: add neovim lauds theme"
```

## Task 4: Final Verification

**Files:**
- Modify: `docs/superpowers/plans/2026-06-07-lauds-light-theme-implementation.md`

- [ ] **Step 1: Run full validation**

Run: `npm test`

Expected: `Lauds validation passed`

- [ ] **Step 2: Check git status**

Run: `git status --short`

Expected: only the implementation plan may be modified with checked boxes, or clean if plan tracking was committed.

- [ ] **Step 3: Review generated files for placeholders**

Run:

```bash
rg -n "TBD|TODO|FIXME|implement later|placeholder" package.json README.md LICENSE .vscodeignore themes colors lua scripts docs/superpowers/plans/2026-06-07-lauds-light-theme-implementation.md
```

Expected: no matches.

- [ ] **Step 4: Commit final plan tracking if changed**

Run:

```bash
git add docs/superpowers/plans/2026-06-07-lauds-light-theme-implementation.md
git commit -m "docs: add lauds implementation plan"
```

If the plan was already committed in Task 1 and no checkbox tracking is committed, skip this commit.

## Self-Review

- Spec coverage: VS Code theme, Neovim theme, shared palette, sparse syntax, setup API, documentation, and validation are covered.
- Placeholder scan: no `TBD`, `TODO`, `FIXME`, or incomplete implementation instructions remain.
- Type consistency: palette keys are consistent across validation, VS Code theme, and Neovim module names.
