local M = {}

M.defaults = {
  bg = "#FFFCF0",
  bg_alt = "#F7F3E8",
  bg_raised = "#EDE8DC",
  border = "#D6D0C4",
  fg = "#101010",
  fg_muted = "#5F6166",
  comment = "#6E7075",
  orange = "#B45A20",
  orange_soft = "#F3D2B8",
  mint = "#147A65",
  mint_soft = "#BFE9DE",
  red = "#C1503F",
  red_soft = "#F6C8BF",
  pink = "#B34A72",
  purple = "#7264A8",
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
