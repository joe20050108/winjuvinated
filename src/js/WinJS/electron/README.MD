# the electron directory is definately part of WinJS, but not in the same exact way as the rest of WinJS
# WinJS.Electron?
# Anyways, this is what allows WinJS to connect with SOME native Windows APIS, and be able to
# Enable accent color again, within an electron app, which obviously is more updated than the WWAHost
# Other things may be added to WinJS like titlebar, titlebar menu.. etc for more electron friendly work.

# NOTE:
# Many things in WinJS that use WinRT straight up will need to be capable of using electron's remote APIS
# thus needing a re-write, including _Accents.ts