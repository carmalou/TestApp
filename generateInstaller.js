var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './build/test-app-win-32-ia32',
    outputDirectory: './build/installer32',
    authors: 'Carmen Long',
    exe: 'test-app.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));