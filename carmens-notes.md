1. First thing I did was wrap all the dev files + node modules + package.json
in a src folder.

This allows for two package.json files. 1 will be the app-dependent modules.
The other will be the .exe dependent modules. (Including electron-packager)

2. installed electron-packager to generate .exe files

3. installed electron-builder && electron winstaller to generate installer
and nupkg files

4. added generateInstaller.js file to run modules to build installer

5. adding autoupdater module to main.js file to hook into squirrel and check
for updates

6. added installer32 folder within builds

7. ran generateInstaller successfully to get the following files:
	- RELEASES
	- app-name-version-full.nupkg
	- app-name-version.nupkg
	- app-name.exe
	- app-name.msi

8. made minor change to index.html && incremented *internal* package.json file

9. re-built .exe && re-built installer

10. start server in build folder so the index.js file feedurl exists

**NOTE** it takes a few minutes to run the generateInstaller script.
its not broken .. just a little slow :) **

** NOTE** For some reason, I had to delete the old .exe && folder manually
to get my build script to run. Check if overwrite flag is still working **
  -- not seeing anything about the flag being deprecated. need to check on
     mac and see what happens
  -- for now just deleting the folder works

** getting error on line 231 about updateFeed not being defined in mainjs **
  -- this was just a mess up on the name. FIXED

** NOTE ** Make sure you increment your package.json version number on the
**internal** json file. This is the one that gets bundled into the app **

** Logs are saying "Update is not available" and RELEASES file doesn't
reflect all the updates. **
    -- I also notice that the .nupkg files are not updating either. seem to 
       be stuck on 1.0.0 and 1.0.1
    -- I might've just been incrementing the wrong package.json file. Very 
       important to make sure you're incrementing the correct file.
