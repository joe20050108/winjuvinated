//loads the CSS for the WinJS titlebar control used for electron
define([
    "./TitleBar/_Buttons",
    "require-style!less/electron/styles-titlebar",
    "require-style!less/electron/colors-titlebar",
], function() {
    //nothing needed here
});
//todo: add actual seperate buttons(duh)
//aka: new controls
/*
WinJS.UI.Electron.TitleBarButton
    Options:
        Type: "(fullscreen/windowed), (minimize), (maximize/restore), (close), (menu)"

WinJS.UI.Electron.TitleBar
(will check to see if electron is present otherwise, wont process it)
    Options:
        Title: "titlebar text",
        Icon: "titlebar icon"
*/