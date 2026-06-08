# Lauds Light Theme Design

## Context

Lauds is a paper-light variant of Vesper. Vesper is described as a "peppermint and orange flavored dark theme for VSCode" and uses a sparse syntax model: white foreground, muted gray structure, orange for functions/tags/numbers/keys, peppermint for strings/insertions, and red for errors.

Lauds keeps that Vesper identity while moving the surface system to Flexoki light. Flexoki describes itself as an inky scheme for prose and code, designed around analog printing inks and warm paper. Its light base provides the primary editor paper color and warm neutral scale.

Reference sources:

- Vesper VS Code: https://github.com/raunofreiberg/vesper
- Vesper Neovim: https://github.com/datsfilipe/vesper.nvim
- Flexoki: https://github.com/kepano/flexoki

## Goals

- Build a light theme named Lauds for both VS Code and Neovim.
- Use Flexoki `paper #FFFCF0` as the primary editor background.
- Preserve Vesper's sparse syntax philosophy rather than introducing broad rainbow highlighting.
- Preserve Vesper's peppermint and orange flavor with light-theme-readable custom accents.
- Keep both ports visually aligned and easy to inspect.
- Avoid runtime network dependencies and avoid a generator for the initial version.

## Non-Goals

- Do not create a dark variant in this implementation.
- Do not port every plugin integration from existing Neovim themes on day one.
- Do not add a palette generator or build pipeline unless duplication becomes painful later.
- Do not copy Flexoki's syntax palette wholesale; Flexoki provides the paper and ink structure, not the full Lauds identity.

## Palette

The approved palette direction is "Paper Vesper": Flexoki light surfaces and ink neutrals, with Vesper-derived peppermint and orange accents tuned for readability on paper.

| Role          | Color     | Purpose                                             |
| ------------- | --------- | --------------------------------------------------- |
| `bg`          | `#FFFCF0` | Primary editor background, Flexoki paper            |
| `bg_alt`      | `#F2F0E5` | Sidebars, widgets, inactive tabs, subtle selections |
| `bg_raised`   | `#E6E4D9` | Inputs, hover states, stronger UI surfaces          |
| `border`      | `#DAD8CE` | Borders, rulers, widget outlines                    |
| `fg`          | `#282726` | Primary text, code foreground                       |
| `fg_muted`    | `#6F6E69` | Keywords, operators, secondary text                 |
| `comment`     | `#878580` | Comments and inactive metadata                      |
| `orange`      | `#B85C20` | Functions, tags, JSON keys, numbers, active UI      |
| `orange_soft` | `#F4C7A2` | Orange-tinted selections, badges, backgrounds       |
| `mint`        | `#1F8F7A` | Strings, inserted diffs, success states             |
| `mint_soft`   | `#BFE8D9` | Mint-tinted diff backgrounds and soft highlights    |
| `red`         | `#AF3029` | Errors, invalid syntax, deletions                   |
| `red_soft`    | `#FFCABB` | Red-tinted diff and diagnostic backgrounds          |

## Syntax Model

Lauds follows Vesper's sparse highlighting:

- Normal variables and plain source text use `fg`.
- Comments use `comment`, optionally italicized in Neovim by default.
- Keywords, operators, punctuation, language variables, regexes, and less important structure use `fg_muted`.
- Functions, methods, tags, attributes where Vesper uses orange, JSON keys, numeric constants, booleans, and markdown headings use `orange`.
- Strings, symbols, inserted text, and successful states use `mint`.
- Invalid syntax, errors, deleted text, and destructive states use `red`.
- Markup emphasis primarily changes font style and avoids introducing extra hues.

This model intentionally keeps color count low so peppermint and orange remain the recognizable accents.

## VS Code Port

The VS Code theme will be a standard extension with:

- `package.json` declaring one contributed theme named `Lauds`.
- `uiTheme: "vs"` for light mode.
- `themes/lauds-light-color-theme.json` containing workbench colors and TextMate token colors.
- `.vscodeignore` to keep packaged contents small.

Workbench colors will cover:

- Editor, selection, gutters, inlay hints, rulers, hover widgets, and bracket highlights.
- Sidebar, activity bar, title bar, tabs, panel, status bar, badges, buttons, inputs, lists, icons, links, scrollbars, and settings indicators.
- Diagnostics, diff editor backgrounds, git gutter colors, and overview ruler accents.

TextMate token colors will follow Vesper's existing scope structure where practical, adapted to the Lauds palette. Special attention goes to JavaScript/TypeScript, JSON, CSS/SCSS, HTML, Markdown, diff, and common markup scopes.

## Neovim Port

The Neovim theme will be a normal Lua colorscheme with this shape:

- `colors/lauds.lua`: entrypoint that loads the theme.
- `lua/lauds/init.lua`: public API with `setup`, `colorscheme`, and exported integrations.
- `lua/lauds/palette.lua`: default palette plus `palette_overrides`.
- `lua/lauds/theme.lua`: highlight group construction.

The setup API will mirror the useful parts of `vesper.nvim`:

```lua
require("lauds").setup({
  transparent = false,
  italics = {
    comments = true,
    keywords = false,
    functions = false,
    strings = false,
    variables = false,
  },
  overrides = {},
  palette_overrides = {},
})
```

Users can activate the theme with either:

```lua
require("lauds").colorscheme()
```

or:

```vim
colorscheme lauds
```

Highlight coverage will include:

- Core editor groups: `Normal`, `Comment`, `CursorLine`, `Visual`, search, folds, menus, line numbers, statusline, tabs, splits, messages, and spelling.
- Diagnostics and LSP references.
- Treesitter captures for variables, functions, strings, constants, keywords, punctuation, tags, attributes, markdown, and diff.
- Git signs and diff groups.
- Practical plugin groups for Telescope, nvim-tree, neo-tree, cmp, which-key, lazy.nvim, gitsigns, bufferline basics, and lualine-friendly palette export.

## Testing And Verification

Verification will be structural and runtime-focused:

- `package.json` parses as JSON and contributes the expected `Lauds` theme file.
- `themes/lauds-light-color-theme.json` parses as JSON with comments if authored as VS Code JSONC.
- Neovim can load the colorscheme in headless mode.
- `require("lauds").setup()` accepts defaults, palette overrides, and highlight overrides.
- The palette module exports every key used by the VS Code and Neovim ports.
- Runtime behavior has no network dependency.

## Open Decisions

There are no open design decisions. The user approved:

- Paper-light direction.
- Flexoki light background.
- Vesper-preserved custom peppermint and orange accents.
- Sparse Vesper-like syntax highlighting.
