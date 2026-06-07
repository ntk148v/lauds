# Lauds

Lauds is a paper-light variant of [Vesper](https://github.com/raunofreiberg/vesper): sparse syntax, peppermint strings, orange functions, and warm paper surfaces. It uses [Flexoki](https://github.com/kepano/flexoki) paper and ink colors as the light foundation while preserving Vesper's accent roles.

## Palette

| Role | Color |
| --- | --- |
| Background | `#FFFCF0` |
| Raised background | `#F2F0E5` |
| Border | `#DAD8CE` |
| Foreground | `#282726` |
| Muted foreground | `#6F6E69` |
| Comment | `#878580` |
| Orange | `#B85C20` |
| Mint | `#1F8F7A` |
| Red | `#AF3029` |

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
