define([

], function() {
    var Remote = {
        tryElectronRemoteModule: function() {
            if(window.remote == undefined) {
                throw new error("Electron remote module is not present. Using fallback.");
            }
            else {
                return;
            }
        }
    }
});