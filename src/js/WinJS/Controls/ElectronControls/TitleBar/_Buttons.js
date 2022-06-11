define([
    'exports',
    '../../../Core/_Global',
    '../../../Core/_WinRT',
    '../../../Core/_Base',
    "../../../Core/_BaseUtils",
    '../../../Core/_ErrorFromName',
    "../../../Core/_Events",
    '../../../Core/_Resources',
    '../../../Utilities/_Control',
    '../../../Utilities/_Dispose',
    '../../../Utilities/_ElementUtilities',
], function(exports, _Global, _WinRT, _Base, _BaseUtils, _ErrorFromName, _Events, _Resources, _Control, _Dispose, _ElementUtilities, _Overlay, Tooltip, _Constants, _Icon) {
    "use strict";

    _Base.Namespace._moduleDefine(exports, "WinJS.UI", {
        TitleButton: _Base.Namespace._lazy(function () {
            function testHandle() {
                console.log("test handle is called due to option true")
            }

            var strings = {
                get unsupportedPlatform() { return "Title Buttons are only supported on the following platforms: Electron."; },
            }
            /*
            0: unused
            1: Fullscreen
            2: Exit Fullscreen
            3: Minimize
            4: Maximize
            5: Restore
            6: Close
            */
            function controlWindow(option) {
                const win = window.require("@electron/remote").getCurrentWindow();
                if(option == 1) {
                    win.setFullScreen(true);
                }
                else if(option == 2) {
                    win.setFullScreen(false);
                }
                else if(option == 3) {
                    win.minimize();
                }
                else if(option == 4) {
                    win.maximize();
                }
                else if(option == 5) {
                    win.restore();
                }
                else if(option == 6) {
                    win.close();
                }
            }


            var TitleButton = _Base.Class.define(function TitleButton_ctor(element, options) {


                //before we even try to do anything, check to see if the control is even supported..
                try {
                    const remote = window.require("@electron/remote");
                    console.log("Electron is supported, will activate control.");
                    //just following what microsoft does..
                    this._element = element;
                    //remember ourselves
                    this._element.winControl = this;
    
                    // Don't blow up if they didn't pass options
                    if (!options) {
                        options = {};
                    }
                    //set the options
                    _Control.setOptions(this, options);

                    _createButton();
                }
                catch(e) {
                    //just following what microsoft does..
                    this._element = element;
                    //remember ourselves
                    this._element.winControl = this;
    
                    // Don't blow up if they didn't pass options
                    if (!options) {
                        options = {};
                    }
                    //set the options
                    _Control.setOptions(this, options);

                    this._createButton();
                }
            },
            {
                test: {
                    get: function() {
                        return this._test;
                    },
                    set: function() {
                        console.log("some testing");
                    }
                },
                //close, maximize_restore, etc
                role: {
                    get: function () {
                        return this._role;
                    },
                    set: function (value) {
                        this._role = value;
                    }
                },

                //create the element
                _createButton: function TitleButton_createButton() {
                    //check for existence of an element
                    if(!this._element) {
                        this._element = _Global.document.createElement("button");
                    }
                    else {
                        // Verify the element was a button
                        if (this._element.tagName !== "BUTTON") {
                            throw new _ErrorFromName("WinJS.UI.AppBarCommand.BadButtonElement", strings.badButtonElement);
                        }
                        // Make sure it has a type="button"
                        var type = this._element.getAttribute("type");
                        if (type === null || type === "" || type === undefined) {
                            this._element.setAttribute("type", "button");
                        }
                        this._element.innerHTML = "";
                    }

                    //initialization bullshit


                    this._element.className = "win-titlebar-button";
                    //give the button its styles and classes based on what type it is
                    if(this.role == "close") {
                        this._element.innerHTML = "\ue8bb";
                        this._element.className = "win-titlebar-button win-titlebar-close-button";
                        this._element.addEventListener("click", () => {controlWindow(6)});
                    }
                    else if(this.role == "fullscreen" || this.role == "exitfullscreen") {
                        this._element.innerHTML = "\ue92d";
                        this._element.addEventListener("click", () => {subHandler(this._element)});
                        function subHandler(elem) {
                            const win = window.require("@electron/remote").getCurrentWindow();
                            if(win.isFullScreen() == true) {
                                controlWindow(2);
                                elem.innerHTML = "\ue92d";
                            }
                            else if(win.isFullScreen() == false) {
                                controlWindow(1);
                                elem.innerHTML = "\ue92c";
                            }
                        }
                    }
                    else if(this.role == "minimize") {
                        this._element.innerHTML = "\ue921";
                        this._element.addEventListener("click", () => {controlWindow(3)});
                    }
                    else if(this.role == "maximize" || this.role == "restore") {
                        this._element.innerHTML = "\ue922";
                        this._element.addEventListener("click", () => {subHandler(this._element)});
                        function subHandler(elem) {
                            const win = window.require("@electron/remote").getCurrentWindow();
                            if(win.isMaximized() == true) {
                                controlWindow(5);
                                elem.innerHTML = "\ue922";   
                            }
                            else if(win.isMaximized() == false) {
                                controlWindow(4);
                                elem.innerHTML = "\ue923";
                            }
                        }
                    }
                }
            });
            return TitleButton;
        }),
    });

    _Base.Namespace._moduleDefine(exports, "WinJS.UI", {
        Command: _Base.Namespace._lazy(function() { return exports.TitleButton; }),
    });
});