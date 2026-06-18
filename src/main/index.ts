import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { spawn, ChildProcess } from 'child_process'
import { existsSync, createWriteStream } from 'fs'
import * as http from 'http'
import * as os from 'os'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let backendProcess: ChildProcess | null = null

function getJavaPath(): string {
  if (is.dev) return 'java'
  const jreExe = process.platform === 'win32' ? 'java.exe' : 'java'
  return join(process.resourcesPath, 'jre', 'bin', jreExe)
}

function getJarPath(): string {
  return join(process.resourcesPath, 'backend', 'app.jar')
}

function startBackend(): void {
  const jarPath = getJarPath()
  if (!existsSync(jarPath)) return

  const logPath = join(os.homedir(), '.kitchapp', 'backend.log')
  const logStream = createWriteStream(logPath, { flags: 'a' })
  logStream.write(`\n--- backend start ${new Date().toISOString()} ---\n`)
  logStream.write(`JAR: ${jarPath}\n`)
  logStream.write(`JRE: ${getJavaPath()}\n`)

  const javaPath = getJavaPath()
  backendProcess = spawn(javaPath, [
    '-jar', jarPath,
    '--spring.profiles.active=portable',
    '--server.port=8080'
  ], { detached: false })

  backendProcess.stdout?.on('data', (d) => logStream.write(d))
  backendProcess.stderr?.on('data', (d) => logStream.write(d))
  backendProcess.on('exit', (code) => logStream.write(`\n--- exit code ${code} ---\n`))
}

function stopBackend(): void {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
}

function waitForBackend(port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs
  const url = `http://127.0.0.1:${port}/api/auth/login`
  return new Promise((resolve, reject) => {
    function attempt(): void {
      const req = http.request(url, { method: 'OPTIONS', timeout: 2000 }, (res) => {
        res.resume()
        resolve()
      })
      req.on('error', () => {
        if (Date.now() > deadline) reject(new Error('Backend did not start in time'))
        else setTimeout(attempt, 1000)
      })
      req.on('timeout', () => {
        req.destroy()
        if (Date.now() > deadline) reject(new Error('Backend did not start in time'))
        else setTimeout(attempt, 1000)
      })
      req.end()
    }
    attempt()
  })
}

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false  // Needed for file:// → http://localhost:8080 requests (no server to set CORS)
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
    window.webContents.on('before-input-event', (_, input) => {
      if (input.key === 'F12') window.webContents.openDevTools()
    })
  })

  ipcMain.on('ping', () => console.log('pong'))

  const mainWindow = createWindow()

  function sendBackendReady(ok: boolean): void {
    if (mainWindow.webContents.isLoading()) {
      mainWindow.webContents.once('did-finish-load', () =>
        mainWindow.webContents.send('backend-ready', ok)
      )
    } else {
      mainWindow.webContents.send('backend-ready', ok)
    }
  }

  const jarExists = existsSync(getJarPath())
  if (jarExists) {
    startBackend()
    waitForBackend(8080, 120000)
      .then(() => sendBackendReady(true))
      .catch(() => sendBackendReady(false))
  } else {
    sendBackendReady(true)
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopBackend()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopBackend()
})
