local M = {}

M.defaults = {
  bg = "#FFFCF0",
  bg_alt = "#F2F0E5",
  bg_raised = "#E6E4D9",
  border = "#DAD8CE",
  fg = "#282726",
  fg_muted = "#6F6E69",
  comment = "#878580",
  orange = "#B85C20",
  orange_soft = "#F4C7A2",
  mint = "#1F8F7A",
  mint_soft = "#BFE8D9",
  red = "#AF3029",
  red_soft = "#FFCABB",
  blue = "#205EA6",
  magenta = "#A02F6F",
  none = "NONE",
}

local function merge(base, override)
  local result = vim.deepcopy(base)

  for key, value in pairs(override or {}) do
    result[key] = value
  end

  return result
end

function M.get(overrides)
  return merge(M.defaults, overrides)
end

return M
