import { app, BrowserWindow, ipcMain } from 'electron';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'reflect-metadata';
import { createDatabase } from 'typeorm-extension';
import { EngineerSchema } from '../src/app/schemas/engineer.schema';

let mainWindow: Electron.BrowserWindow | null;

const isDevMode = process.execPath.match(/[\\/]electron/);

const createWindow = async () => {
    const options: DataSourceOptions = {
        type: 'sqlite',
        synchronize: true,
        logging: false,
        logger: 'simple-console',
        database: 'database.sqlite',
        entities: [EngineerSchema]
    };

    await createDatabase({
        options,
        // ifNotExist: true
    });

    const dataSource = new DataSource(options);
    dataSource.initialize();

    const engineerRepo = dataSource.getRepository(EngineerSchema);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration in the renderer process
            contextIsolation: false, // Disable context isolation for easier access to Electron APIs
        },
    });

    mainWindow.loadURL(`file://${__dirname}/../durand-train-board/browser/index.html`); // Load your Angular app

    // Open the DevTools.
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    ipcMain.on('get-engineers', async (event: any, ...args: any[]) => {
        try {
            event.returnValue = await engineerRepo.find();
        } catch (err) {
            throw err;
        }
    });

    ipcMain.on('add-engineer', async (event: any, _engineer: EngineerSchema) => {
        try {
            const engineer = await engineerRepo.create(_engineer);
            await engineerRepo.save(engineer);
            event.returnValue = await engineerRepo.find();
        } catch (err) {
            throw err;
        }
    });

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
