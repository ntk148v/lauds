" Vim entry point for the lauds colorscheme.
"
" Vim's :colorscheme only sources colors/<name>.vim and never reads
" colors/<name>.lua, so without this file :colorscheme lauds fails with
" E185 on Vim. The vimcompat layer supplies the Neovim-only Lua API
" (vim.o, vim.api.nvim_set_hl, vim.tbl_deep_extend, ...) that lauds needs,
" and is a complete no-op on Neovim.
"
" On Neovim this file may be sourced in preference to colors/lauds.lua, so
" hand straight back to the Lua entry point to guarantee one behavior.

if has("nvim")
  silent! runtime colors/lauds.lua
  finish
endif

if exists("syntax_on")
  syntax reset
endif
highlight clear

lua << EOF
if vim.fn.has('nvim') == 0 then
  local ok = pcall(require, 'vimcompat')
  if ok then
    require('vimcompat').setup()
  end
end

-- Never let a colorscheme raise; report instead of leaving Vim in a
-- half-loaded state.
local ok = pcall(function()
  require('lauds').colorscheme()
end)
if not ok then
  vim.cmd('echohl ErrorMsg | echomsg "lauds: failed to load on Vim" | echohl None')
end
EOF

let g:colors_name = "lauds"