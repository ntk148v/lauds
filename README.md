# Lauds

Lauds is a paper-light variant of [Vesper](https://github.com/raunofreiberg/vesper): sparse syntax, peppermint strings, orange functions, and cool charcoal structure. It keeps [Flexoki](https://github.com/kepano/flexoki) paper as the background while moving the rest of the palette toward Vesper's sharper mint, orange, pink, and purple identity.

## Palette

| Role                 | Color     |
| -------------------- | --------- |
| Background           | `#FFFCF0` |
| Alternate background | `#F7F3E8` |
| Raised background    | `#EDE8DC` |
| Border               | `#D6D0C4` |
| Foreground           | `#101010` |
| Muted foreground     | `#5F6166` |
| Comment              | `#7B7D82` |
| Orange               | `#B45A20` |
| Mint                 | `#16866F` |
| Red                  | `#C1503F` |
| Pink                 | `#B34A72` |
| Purple               | `#7264A8` |

## VS Code

Install the extension locally or package it with `vsce`, then select `Lauds` from the color theme picker.

## Neovim

With a plugin manager, point to this repository and load:

```lua
require("lauds").setup({
  transparent = false,
  italics = {
    comments = true,
  },
})

vim.cmd.colorscheme("lauds")
```

The colorscheme can also be loaded directly:

```vim
colorscheme lauds
```

## Validation

```bash
npm test
```
