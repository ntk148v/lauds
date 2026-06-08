# Lauds Vesper-Forward Redesign

## Context

The current Lauds palette reads too much like Flexoki. It uses Flexoki paper and much of Flexoki's warm ink/surface structure. The next version should keep Lauds light and readable while making the theme feel more like Vesper.

The user supplied Vesper Light as an additional reference:

- https://github.com/samueldsr99/vesper-light/raw/refs/heads/main/themes/Vesper%20light-color-theme.json

Direct raw fetch was blocked in this environment, so the design uses the accessible Vesper Light Marketplace summary, original Vesper identity, and the known Vesper terminal palette as reference anchors. The known Vesper identity is sparse, cool/dark neutral structure with peppermint strings and orange function/UI accents.

## Branch

Work happens on:

- `feat/vesper-forward`

## Goals

- Make Lauds feel more Vesper and less Flexoki.
- Keep Flexoki only as the paper background: `#FFFCF0`.
- Replace Flexoki's warm ink scale with cooler Vesper-like charcoal and graphite neutrals.
- Keep the theme readable and restrained on a light background.
- Preserve sparse Vesper syntax mapping:
  - mint for strings, insertions, success
  - orange for functions, methods, tags, JSON keys, numbers, booleans, active UI
  - muted graphite for keywords, operators, punctuation, secondary UI
  - cool gray for comments
  - red for errors and deletions
- Carry the redesign consistently across VS Code, Neovim, and pywal.

## Non-Goals

- Do not make Lauds a direct clone of Vesper Light.
- Do not make the accents neon or highlighter-like.
- Do not introduce broad rainbow syntax highlighting.
- Do not rewrite the theme structure or public Neovim API.
- Do not remove `#FFFCF0` as the primary editor background.

## Approved Palette

| Role | Color | Purpose |
| --- | --- | --- |
| `bg` | `#FFFCF0` | Primary editor background, the only retained Flexoki anchor |
| `bg_alt` | `#F7F3E8` | Sidebar, inactive tabs, panels, soft alternate surface |
| `bg_raised` | `#EDE8DC` | Inputs, hovers, active rows, stronger surface contrast |
| `border` | `#D6D0C4` | Borders, rulers, separators |
| `fg` | `#101010` | Primary Vesper-like near-black text |
| `fg_muted` | `#5F6166` | Keywords, operators, punctuation, secondary UI |
| `comment` | `#7B7D82` | Comments and inactive metadata |
| `orange` | `#B45A20` | Functions, methods, tags, JSON keys, numbers, active UI |
| `orange_soft` | `#F3D2B8` | Orange-tinted selections, search, diagnostic backgrounds |
| `mint` | `#16866F` | Strings, insertions, success |
| `mint_soft` | `#BFE9DE` | Mint-tinted diff and info backgrounds |
| `red` | `#C1503F` | Errors, invalid syntax, deletions |
| `red_soft` | `#F6C8BF` | Red-tinted diff and diagnostic backgrounds |
| `pink` | `#B34A72` | Terminal/plugin accent, Vesper-adjacent secondary color |
| `purple` | `#7264A8` | Terminal/plugin accent, Vesper-adjacent secondary color |

## Syntax Design

Core syntax remains sparse:

- Strings and symbols use `mint`.
- Functions, methods, tags, JSON keys, numeric constants, booleans, and markdown headings use `orange`.
- Keywords, operators, punctuation, delimiters, regexes, language variables, and secondary structural scopes use `fg_muted`.
- Normal identifiers and plain source use `fg`.
- Comments use `comment`, italicized where already supported.
- Errors and deleted text use `red`.
- Extra colors `pink` and `purple` are reserved for terminal ANSI colors and selected plugin/UI accents. They should not make the main editor syntax colorful.

## Implementation Scope

Update existing files only:

- `lua/lauds/palette.lua`: replace palette defaults.
- `themes/lauds-light-color-theme.json`: update workbench colors, token colors, semantic token colors, and terminal ANSI colors.
- `variants/pywal/lauds.json`: update pywal special colors and terminal color slots.
- `scripts/validate.js`: update expected palette anchors for the new values.
- `README.md`: update the palette table to match the new direction.

Neovim highlight group structure can stay mostly intact because it already consumes palette role names. Only direct assumptions or added accent roles should change if needed.

## Validation

Run:

```bash
npm test
```

Expected:

```text
Lauds validation passed
```

Also run direct Neovim load:

```bash
env NVIM_LOG_FILE=/tmp/lauds-nvim.log nvim --headless -u NONE -i NONE -c 'set rtp^=.' -c "lua require('lauds').setup()" -c 'colorscheme lauds' -c 'qa'
```

Expected: exit code `0`.

## Open Decisions

There are no open design decisions. The user approved:

- Flexoki only as paper background.
- Readable but restrained Vesper accents.
- Cool charcoal neutral direction.
- Mint strings with orange functions/numbers/UI.
