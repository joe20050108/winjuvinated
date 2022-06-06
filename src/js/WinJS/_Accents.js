// Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.

//switching to using a javascript compiled version of the module
//reason: I don't want to deal with typescript right now

define([
    "require",
    "exports",
    "./Core/_Global",
    "./Core/_WinRT",
    "./Core/_Base",
    "./Core/_BaseUtils",
    './Utilities/_ElementUtilities',
    "./_Accents/_Remote",
    "./_Accents/_tinycolor",
], function (require, exports, _Global, _WinRT, _Base, _BaseUtils, _ElementUtilities, _Remote, tinycolor) {
    var Constants = {
        accentStyleId: "WinJSAccentsStyle",
        themeDetectionTag: "winjs-themedetection-tag",
        hoverSelector: "html.win-hoverable",
        lightThemeSelector: ".win-ui-light",
        darkThemeSelector: ".win-ui-dark"
    };
    var CSSSelectorTokens = [".", "#", ":"];
    var UISettings = null;
    var colors = [];
    var isDarkTheme = false;
    var rules = [];
    var writeRulesTOHandle = -1;
    // Public APIs
    //
    // Enum values align with the colors array indices
    (function (ColorTypes) {
        ColorTypes[ColorTypes["accent"] = 0] = "accent";
        ColorTypes[ColorTypes["listSelectRest"] = 1] = "listSelectRest";
        ColorTypes[ColorTypes["listSelectHover"] = 2] = "listSelectHover";
        ColorTypes[ColorTypes["listSelectPress"] = 3] = "listSelectPress";
        ColorTypes[ColorTypes["_listSelectRestInverse"] = 4] = "_listSelectRestInverse";
        ColorTypes[ColorTypes["_listSelectHoverInverse"] = 5] = "_listSelectHoverInverse";
        ColorTypes[ColorTypes["_listSelectPressInverse"] = 6] = "_listSelectPressInverse";
    })(exports.ColorTypes || (exports.ColorTypes = {}));
    var ColorTypes = exports.ColorTypes;
    function createAccentRule(selector, props) {
        rules.push({ selector: selector, props: props });
        scheduleWriteRules();
    }
    exports.createAccentRule = createAccentRule;
    // Private helpers
    //
    function scheduleWriteRules() {
        if (rules.length === 0 || writeRulesTOHandle !== -1) {
            return;
        }
        writeRulesTOHandle = _BaseUtils._setImmediate(function () {
            writeRulesTOHandle = -1;
            cleanup();
            var inverseThemeSelector = isDarkTheme ? Constants.lightThemeSelector : Constants.darkThemeSelector;
            var inverseThemeHoverSelector = Constants.hoverSelector + " " + inverseThemeSelector;
            var style = _Global.document.createElement("style");
            style.id = Constants.accentStyleId;
            style.textContent = rules.map(function (rule) {
                // example rule: { selector: "  .foo,   html.win-hoverable   .bar:hover ,  div:hover  ", props: [{ name: "color", value: 0 }, { name: "background-color", value: 1 } }
                var body = "  " + rule.props.map(function (prop) { return prop.name + ": " + colors[prop.value] + ";"; }).join("\n  ");
                // body = color: *accent*; background-color: *listSelectHover*
                var selectorSplit = rule.selector.split(",").map(function (str) { return sanitizeSpaces(str); }); // [".foo", ".bar:hover", "div"]
                var selector = selectorSplit.join(",\n"); // ".foo, html.win-hoverable .bar:hover, div:hover"
                var css = selector + " {\n" + body + "\n}";
                // css = .foo, html.win-hoverable .bar:hover, div:hover { *body* }
                // Inverse Theme Selectors
                var isThemedColor = rule.props.some(function (prop) { return prop.value !== 0 /* accent */; });
                if (isThemedColor) {
                    var inverseBody = "  " + rule.props.map(function (prop) { return prop.name + ": " + colors[(prop.value ? (prop.value + 3) : prop.value)] + ";"; }).join("\n  ");
                    // inverseBody = "color: *accent*; background-color: *listSelectHoverInverse"
                    var themedSelectors = [];
                    selectorSplit.forEach(function (sel) {
                        if (sel.indexOf(Constants.hoverSelector) !== -1 && sel.indexOf(inverseThemeHoverSelector) === -1) {
                            themedSelectors.push(sel.replace(Constants.hoverSelector, inverseThemeHoverSelector));
                            var selWithoutHover = sel.replace(Constants.hoverSelector, "").trim();
                            if (CSSSelectorTokens.indexOf(selWithoutHover[0]) !== -1) {
                                themedSelectors.push(sel.replace(Constants.hoverSelector + " ", inverseThemeHoverSelector));
                            }
                        }
                        else {
                            themedSelectors.push(inverseThemeSelector + " " + sel);
                            if (CSSSelectorTokens.indexOf(sel[0]) !== -1) {
                                themedSelectors.push(inverseThemeSelector + sel);
                            }
                        }
                        css += "\n" + themedSelectors.join(",\n") + " {\n" + inverseBody + "\n}";
                    });
                }
                return css;
            }).join("\n");
            _Global.document.head.appendChild(style);
        });
    }


    function handleColorsChanged() {
        var UIColorType = _WinRT.Windows.UI.ViewManagement.UIColorType;
        var uiColor = UISettings.getColorValue(_WinRT.Windows.UI.ViewManagement.UIColorType.accent);
        var accent = colorToString(uiColor, 1);
        if (colors[0] === accent) {
            return;
        }
        // Establish colors
        // The order of the colors align with the ColorTypes enum values
        colors.length = 0;
        colors.push(
            accent,
            colorToString(uiColor, (isDarkTheme ? 0.6 : 0.4)),
            colorToString(uiColor, (isDarkTheme ? 0.8 : 0.6)),
            colorToString(uiColor, (isDarkTheme ? 0.9 : 0.7)),
            colorToString(uiColor, (isDarkTheme ? 0.4 : 0.6)),
            colorToString(uiColor, (isDarkTheme ? 0.6 : 0.8)),
            colorToString(uiColor, (isDarkTheme ? 0.7 : 0.9)));
        scheduleWriteRules();
    }

    //equivalent function for electron fallback
    function handleColorsChangedElectron() {
        var uiColor = remote.systemPreferences.getAccentColor();
        console.log(uiColor);
        colors.length = 0;
        colors.push(
            "#" + uiColor,
            hexToString(uiColor, (isDarkTheme ? 0.6 : 0.4)),
            hexToString(uiColor, (isDarkTheme ? 0.8 : 0.6)),
            hexToString(uiColor, (isDarkTheme ? 0.9 : 0.7)),
            hexToString(uiColor, (isDarkTheme ? 0.4 : 0.6)),
            hexToString(uiColor, (isDarkTheme ? 0.6 : 0.8)),
            hexToString(uiColor, (isDarkTheme ? 0.7 : 0.9)));
            console.log(colors);
        //scheduleWriteRules();
    }

    function colorToString(color, alpha) {
        return "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
    }

    //takes advantage of tinycolor, and is designed for electron based accent color
    function hexToString(color, alpha) {
        var newColor = new tinycolor(color);
        console.log(newColor);
        return "rgba(" + newColor._r + "," + newColor._g + "," + newColor._b + "," + alpha + ")";
    }

    function sanitizeSpaces(str) {
        return str.replace(/  /g, " ").replace(/  /g, " ").trim();
    }
    function cleanup() {
        var style = _Global.document.head.querySelector("#" + Constants.accentStyleId);
        style && style.parentNode.removeChild(style);
    }
    function _reset() {
        rules.length = 0;
        cleanup();
    }
    // Module initialization
    //
    // Figure out color theme
    var tag = _Global.document.createElement(Constants.themeDetectionTag);
    _Global.document.head.appendChild(tag);
    var cs = _ElementUtilities._getComputedStyle(tag);
    isDarkTheme = cs.opacity === "0";
    tag.parentElement.removeChild(tag);
    try {
        UISettings = new _WinRT.Windows.UI.ViewManagement.UISettings();
        UISettings.addEventListener("colorvalueschanged", handleColorsChanged);
        handleColorsChanged();
    }
    catch (e) {

        //try to see if we can use electron apis
        try {
            // No WinRT, Electron Remote is present - Use accent colors
            const { systemPreferences } = window.remote;
            handleColorsChangedElectron();
        }
        catch(e) {
            // No WinRT, No Electron Remote - use hardcoded blue accent color
            // The order of the colors align with the ColorTypes enum values
            colors.push(
                "rgb(0, 120, 215)",
                "rgba(0, 120, 215, " + (isDarkTheme ? "0.6" : "0.4") + ")",
                "rgba(0, 120, 215, " + (isDarkTheme ? "0.8" : "0.6") + ")",
                "rgba(0, 120, 215, " + (isDarkTheme ? "0.9" : "0.7") + ")",
                "rgba(0, 120, 215, " + (isDarkTheme ? "0.4" : "0.6") + ")",
                "rgba(0, 120, 215, " + (isDarkTheme ? "0.6" : "0.8") + ")",
                "rgba(0, 120, 215, " + (isDarkTheme ? "0.7" : "0.9") + ")");
        }
    }
    // Publish to WinJS namespace
    var toPublish = {
        ColorTypes: ColorTypes,
        createAccentRule: createAccentRule,
        // Exposed for tests    
        _colors: colors,
        _reset: _reset,
        _isDarkTheme: isDarkTheme,
    };
    _Base.Namespace.define("WinJS.UI._Accents", toPublish);
});
