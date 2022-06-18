//Warning for a preview version of WinJS
define([
    'exports',
    '../Core/_Global',
    '../Core/_WinRT',
    '../Core/_Base',
    "../Core/_BaseUtils",
    '../Core/_ErrorFromName',
    "../Core/_Events",
    '../Core/_Resources',
    '../Utilities/_Control',
    '../Utilities/_Dispose',
    '../Utilities/_ElementUtilities',
], function(exports, _Global, _WinRT, _Base, _BaseUtils, _ErrorFromName, _Events, _Resources, _Control, _Dispose, _ElementUtilities) {
    "use strict";
    _Base.Namespace._moduleDefine(exports, "WinJS.UI", {
        WaterMark: _Base.Namespace._lazy(function() {
            var WaterMark = _Base.Class.define(function WaterMark_CTOR() {
                var mark = document.createElement("div");
                mark.id = "watermark";
                mark.style = "position: absolute; right: 0; bottom: 0; z-index: 99999; display: grid;";
                var firstText = document.createElement("span");
                firstText.innerHTML = "NOTICE: This version of the Windows Library for JavaScript is NOT a release version."
                var secondText = document.createElement("span");
                secondText.innerHTML = "The User Interface is still subject to change and may rapidly change."
                var removeText = document.createElement("span");
                removeText.innerHTML = "Run \"watermark.remove()\" to clear this message.";
                mark.appendChild(firstText);
                mark.appendChild(secondText);
                mark.appendChild(removeText);
                window.onload = function() {
                    document.body.appendChild(mark);
                }
            },
            {
                remove: function() {
                    this.mark.remove();
                }
            });
            return WaterMark;
        }),
    });
    _Base.Namespace._moduleDefine(exports, "WinJS.UI", {
        Command: _Base.Namespace._lazy(function() { return exports.WaterMark }),
    });
    new WinJS.UI.WaterMark();
});