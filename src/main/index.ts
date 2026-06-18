import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { spawn, ChildProcess } from 'child_process'
import { existsSync } from 'fs'
import * as net from 'net'
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

  const javaPath = getJavaPath()
  backendProcess = spawn(javaPath, [
    '-jar', jarPath,
    '--spring.profiles.active=portable',
    '--server.port=8080'
  ], { detached: false })

  backendProcess.stdout?.on('data', (data) => process.stdout.write(`[backend] ${data}`))
  backendProcess.stderr?.on('data', (data) => process.stderr.write(`[backend] ${data}`))
}

function stopBackend(): void {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
}

function waitForBackend(port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs
  return new Promise((resolve, reject) => {
    function attempt(): void {
      const socket = new net.Socket()
      socket.setTimeout(1000)
      socket.on('connect', () => { socket.destroy(); resolve() })
      socket.on('error', () => {
        socket.destroy()
        if (Date.now() > deadline) reject(new Error('Backend did not start in time'))
        else setTimeout(attempt, 500)
      })
      socket.on('timeout', () => {
        socket.destroy()
        if (Date.now() > deadline) reject(new Error('Backend did not start in time'))
        else setTimeout(attempt, 500)
      })
      socket.connect(port, '127.0.0.1')
    }
    attempt()
  })
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  const jarExists = existsSync(getJarPath())
  if (jarExists) {
    startBackend()
    try {
      await waitForBackend(8080, 60000)
    } catch {
      console.error('Backend failed to start within 60 seconds')
    }
  }

  createWindow()

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
