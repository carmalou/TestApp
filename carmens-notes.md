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

9. re-built .exe && re-built installer (I run the generateInstaller script from the command line with `node generateInstaller.js`)

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

I got the following stack trace in my console when I tried to generate the installer:

```
λ node generateInstaller.js
No dice: Failed with exit code: 4294967295
Output:
System.AggregateException: One or more errors occurred. ---> System.Exception: 7-Zip [64] 16.04 : Copyright (c) 1999-2016 Igor Pavlov : 2016-10-04

Open archive: C:\Development\TestApp\build\installer32\TestApp-1.0.3-full.nupkg

WARNINGS:
There are data after the end of archive

--
Path = C:\Development\TestApp\build\installer32\TestApp-1.0.3-full.nupkg
Type = zip
ERRORS:
Headers Error
Unconfirmed start of archive
WARNINGS:
There are data after the end of archive
Physical Size = 20387628
Tail Size = 19458260


Error:
There is some data block after the end of the archive
Not implemented


ERRORS:
Headers Error
Unconfirmed start of archive



System ERROR:
Not implemented
   at Squirrel.Utility.<CreateZipFromDirectory>d__23.MoveNext()
   --- End of inner exception stack trace ---
   at System.Threading.Tasks.Task.Wait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.Wait()
   at Squirrel.ReleasePackage.CreateReleasePackage(String outputFile, String packagesRootDir, Func`2 releaseNotesProcessor, Action`1 contentsPostProcessHook)
   at Squirrel.Update.Program.Releasify(String package, String targetDir, String packagesDir, String bootstrapperExe, String backgroundGif, String signingOpts, String baseUrl, String setupIcon, Boolean generateMsi, String frameworkVersion, Boolean generateDeltas)
   at Squirrel.Update.Program.executeCommandLine(String[] args)
   at Squirrel.Update.Program.main(String[] args)
   at Squirrel.Update.Program.Main(String[] args)
---> (Inner Exception #0) System.Exception: 7-Zip [64] 16.04 : Copyright (c) 1999-2016 Igor Pavlov : 2016-10-04

Open archive: C:\Development\TestApp\build\installer32\TestApp-1.0.3-full.nupkg

WARNINGS:
There are data after the end of archive

--
Path = C:\Development\TestApp\build\installer32\TestApp-1.0.3-full.nupkg
Type = zip
ERRORS:
Headers Error
Unconfirmed start of archive
WARNINGS:
There are data after the end of archive
Physical Size = 20387628
Tail Size = 19458260


Error:
There is some data block after the end of the archive
Not implemented


ERRORS:
Headers Error
Unconfirmed start of archive



System ERROR:
Not implemented
   at Squirrel.Utility.<CreateZipFromDirectory>d__23.MoveNext()<---

```