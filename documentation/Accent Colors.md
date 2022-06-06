# How to enable accent colors in the WinJuvinated fork of WinJS.
<h3>A quick note:<h3>
WinJuvinated is a fork of WinJS, which is being updated to be consistent with WinUI3.
One of the new features is support for accent colors using electron, as the WWAHost framework is starting
to show its age compared to browsers like chromium(WWAHost uses IE tech!). 

Due to us no longer having the WinRT API, we had to modify code to be able to support accent colors in electron
The implementation is almost the same, but requires adding a little bit of code to your script.
# How to enable accent colors in electron:
Its quite easy, what you need to is make sure to have the @electron/remote module installed, and initialize it in your main process.
The next step is VERY important, and won't work unless you do it properly.(Even if it is simple it can still be a pain!)
<h4>Important<h4>
Locate where your base.js and ui.js WinJS scripts's TAGS are placed within your HTML, and directly above that, add an INLINE script with the following code:
<span>"window.remote = require("@electron/remote");"</span>
<h4>Result:<h4>
If nothing went wrong, accent colors should be working in WinJS on electron.(Sadly browsers aren't supported, just electron apps).

<h4>More Info<h4>
How it works: "PLACELINKHERE"