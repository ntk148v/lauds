local palette = require("lauds.palette")
local theme = require("lauds.theme")

local M = {}

local defaults = {
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
}

local config = vim.deepcopy(defaults)

local function merge(base, override)
  return vim.tbl_deep_extend("force", base, override or {})
end

local function normalize_highlight(value)
  local result = {}

  for key, item in pairs(value) do
    if item ~= nil then
      result[key] = item
    end
  end

  return result
end

function M.setup(opts)
  config = merge(vim.deepcopy(defaults), opts)
end

function M.palette()
  return palette.get(config.palette_overrides)
end

function M.theme()
  return theme.get(M.palette(), config)
end

function M.lualine()
  return theme.lualine(M.palette(), config)
end

function M.colorscheme()
  vim.o.termguicolors = true
  vim.o.background = "light"

  if vim.g.colors_name then
    vim.cmd("highlight clear")
  end

  vim.g.colors_name = "lauds"

  local highlights = merge(M.theme(), config.overrides)
  for group, highlight in pairs(highlights) do
    vim.api.nvim_set_hl(0, group, normalize_highlight(highlight))
  end
end

return M
