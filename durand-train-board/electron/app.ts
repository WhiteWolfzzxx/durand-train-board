import { app, BrowserWindow, ipcMain } from 'electron';
// import { DataSource, DataSourceOptions } from 'typeorm';
import 'reflect-metadata';
// import { RollingStockSchema } from '../src/app/schemas/rolling-stock.schema';
// import { createDatabase } from 'typeorm-extension';

let mainWindow: Electron.BrowserWindow | null;

const isDevMode = process.execPath.match(/[\\/]electron/);

const createWindow = async () => {
    // const options: DataSourceOptions = {
    //     type: 'sqlite',
    //     synchronize: true,
    //     logging: false,
    //     logger: 'simple-console',
    //     database: './src/assets/data/database.sqlite',
    //     entities: [RollingStockSchema]
    // };

    // await createDatabase({
    //     options,
    //     ifNotExist: true
    // });

    // const dataSource = new DataSource(options);
    // dataSource.initialize();

    // const rollingStockRepo = dataSource.getRepository(RollingStockSchema);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration in the renderer process
            contextIsolation: false, // Disable context isolation for easier access to Electron APIs
        },
    });

    mainWindow.loadURL(`file://${__dirname}/durand-train-board/browser/index.html`); // Load your Angular app

    // Open the DevTools.
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // ipcMain.on('get-rolling-stock', async (event: any, ...args: any[]) => {
    //     try {
    //         event.returnValue = await rollingStockRepo.find({
    //             order: {
    //                 reportingMark: 'ASC',
    //                 number: 'ASC',
    //                 type: 'ASC'
    //             }
    //         });
    //     } catch (err) {
    //         throw err;
    //     }
    // });

    // ipcMain.on('add-rolling-stock', async (event: any, _rollingStock: RollingStockSchema) => {
    //     try {
    //         const rollingStock = await rollingStockRepo.create(_rollingStock);
    //         await rollingStockRepo.save(rollingStock);
    //         event.returnValue = await rollingStockRepo.find();
    //     } catch (err) {
    //         throw err;
    //     }
    // });

    // ipcMain.on('delete-rolling-stock', async (event:any, _rollingStock: RollingStockSchema) => {
    //     try {
    //         const rollingStock = await rollingStockRepo.create(_rollingStock);
    //         await rollingStockRepo.remove(rollingStock);
    //         event.returnValue = await rollingStockRepo.find();
    //     } catch (err) {
    //         throw err;
    //     }
    // })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
