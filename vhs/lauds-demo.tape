Output lauds-demo.gif

Require nvim

Set Shell "bash"
Set FontSize 14
Set FontFamily "Liga SFMono Nerd Font"
Set Width 1200
Set Height 800
Set Padding 32
Set Theme {"background":"#FFFCF0","foreground":"#101010","cursor":"#B45A20","selection":"#F3D2B8","color_0":"#D6D0C4","color_1":"#C1503F","color_2":"#147A65","color_3":"#B45A20","color_4":"#7264A8","color_5":"#B34A72","color_6":"#16866F","color_7":"#5F6166","color_8":"#EDE8DC","color_9":"#C1503F","color_10":"#147A65","color_11":"#B45A20","color_12":"#938BB5","color_13":"#B34A72","color_14":"#16866F","color_15":"#101010"}
Set Framerate 15
Set TypingSpeed 45ms

# Navigate to the lauds repo and open Neovim with the colorscheme
Hide
Type "cd /home/kien/.local/share/nvim/site/pack/core/opt/lauds"
Sleep 100ms
Enter
Sleep 200ms

Type "nvim -c 'colorscheme lauds' lua/lauds/palette.lua"
Sleep 200ms
Enter
Sleep 2s

# Show the palette file
Show
Sleep 1s

# Scroll a bit
Down 3
Sleep 500ms
Up 3
Sleep 400ms

# Open theme.lua in vertical split
Type ":vsp lua/lauds/theme.lua"
Sleep 300ms
Enter
Sleep 1.5s

# Scroll in theme.lua
Down 5
Sleep 600ms

# Search for Treesitter section
Type "/Treesitter"
Sleep 300ms
Enter
Sleep 800ms

Down 2
Sleep 500ms

# Switch to left window and open README
Type ":e README.md"
Sleep 300ms
Enter
Sleep 1.5s

# Scroll down README
Down 6
Sleep 400ms
Down 4
Sleep 400ms

# Quit
Type ":q"
Sleep 200ms
Enter
