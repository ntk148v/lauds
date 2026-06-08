# Lauds Vesper-Forward Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Flexoki-heavy Lauds palette with the approved Vesper-forward light palette across VS Code, Neovim, pywal, validation, and README.

**Architecture:** The existing theme structure stays intact. The palette role names remain stable, so most changes are direct color substitutions plus validator expectations for the new anchors.

**Tech Stack:** VS Code theme JSON, Neovim Lua colorscheme, pywal JSON, Node.js validation script.

---

## File Structure

- Modify `scripts/validate.js`: assert Vesper-forward anchors.
- Modify `lua/lauds/palette.lua`: replace palette defaults with approved Vesper-forward values.
- Modify `lua/lauds/theme.lua`: rename the rare accent from `magenta` to `pink` if the palette key changes.
- Modify `themes/lauds-light-color-theme.json`: replace workbench, token, semantic, and terminal colors.
- Modify `variants/pywal/lauds.json`: replace pywal terminal slots.
- Modify `README.md`: update palette description and table.

## Task 1: Red Validation Anchors

- [ ] **Step 1: Update validator expected colors**

Change `scripts/validate.js` so the checks expect:

```text
editor.foreground #101010
button.background #B45A20
String token #16866F
Function token #B45A20
Comment token #7B7D82
palette required values #FFFCF0 #101010 #B45A20 #16866F #C1503F
pywal foreground #101010
pywal cursor #B45A20
pywal color1 #C1503F
pywal color3 #B45A20
pywal color6 #16866F
pywal color7 #F7F3E8
```

- [ ] **Step 2: Run red check**

Run:

```bash
npm test
```

Expected: fail because the theme files still contain the previous colors.

## Task 2: Palette Sources

- [ ] **Step 1: Update Neovim palette**

Replace `lua/lauds/palette.lua` defaults with:

```lua
bg = "#FFFCF0"
bg_alt = "#F7F3E8"
bg_raised = "#EDE8DC"
border = "#D6D0C4"
fg = "#101010"
fg_muted = "#5F6166"
comment = "#7B7D82"
orange = "#B45A20"
orange_soft = "#F3D2B8"
mint = "#16866F"
mint_soft = "#BFE9DE"
red = "#C1503F"
red_soft = "#F6C8BF"
pink = "#B34A72"
purple = "#7264A8"
```

- [ ] **Step 2: Update Neovim theme rare accent**

Change `SpellRare` in `lua/lauds/theme.lua` from `c.magenta` to `c.pink`.

## Task 3: VS Code And Pywal Theme Files

- [ ] **Step 1: Update VS Code theme**

Replace previous palette values in `themes/lauds-light-color-theme.json`:

```text
#F2F0E5 -> #F7F3E8
#E6E4D9 -> #EDE8DC
#DAD8CE -> #D6D0C4
#282726 -> #101010
#6F6E69 -> #5F6166
#878580 -> #7B7D82
#B85C20 -> #B45A20
#9D4310 -> #934414
#F4C7A2 -> #F3D2B8
#1F8F7A -> #16866F
#BFE8D9 -> #BFE9DE
#AF3029 -> #C1503F
#FFCABB -> #F6C8BF
#205EA6 -> #7264A8
#A02F6F -> #B34A72
```

- [ ] **Step 2: Update pywal scheme**

Set `variants/pywal/lauds.json` to:

```json
{
  "refer": "https://github.com/ntk148v/lauds",
  "special": {
    "background": "#FFFCF0",
    "foreground": "#101010",
    "cursor": "#B45A20"
  },
  "colors": {
    "color0": "#101010",
    "color1": "#C1503F",
    "color2": "#16866F",
    "color3": "#B45A20",
    "color4": "#7264A8",
    "color5": "#B34A72",
    "color6": "#16866F",
    "color7": "#F7F3E8",
    "color8": "#5F6166",
    "color9": "#C1503F",
    "color10": "#16866F",
    "color11": "#B45A20",
    "color12": "#7264A8",
    "color13": "#B34A72",
    "color14": "#16866F",
    "color15": "#FFFCF0"
  }
}
```

## Task 4: Documentation And Verification

- [ ] **Step 1: Update README**

Describe Lauds as using Flexoki paper with cooler Vesper-forward neutrals. Update the palette table to include `#101010`, `#5F6166`, `#7B7D82`, `#B45A20`, `#16866F`, `#C1503F`, `#B34A72`, and `#7264A8`.

- [ ] **Step 2: Run green checks**

Run:

```bash
npm test
env NVIM_LOG_FILE=/tmp/lauds-nvim.log nvim --headless -u NONE -i NONE -c 'set rtp^=.' -c "lua require('lauds').setup()" -c 'colorscheme lauds' -c 'qa'
```

Expected: both commands exit `0`, with `npm test` printing `Lauds validation passed`.

- [ ] **Step 3: Commit implementation**

Stage only implementation files and this plan:

```bash
git add scripts/validate.js lua/lauds/palette.lua lua/lauds/theme.lua themes/lauds-light-color-theme.json variants/pywal/lauds.json README.md docs/superpowers/plans/2026-06-08-lauds-vesper-forward-implementation.md
git commit -m "feat: make lauds more vesper-forward"
```

## Self-Review

- Spec coverage: all files listed in the redesign spec are included.
- Placeholder scan: no placeholders or deferred implementation steps remain.
- Type consistency: palette role names match existing Neovim consumers, with `pink` replacing `magenta` in the one direct highlight use.
