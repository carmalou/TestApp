1. First thing I did was wrap all the dev files + node modules + package.json
in a src folder.

This allows for two package.json files. 1 will be the app-dependent modules.
The other will be the .exe dependent modules. (Including electron-packager)
