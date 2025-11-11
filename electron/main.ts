import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'
import fs from 'fs/promises'
import { existsSync } from 'fs'

let mainWindow: BrowserWindow | null = null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

// Store active processes
const activeProcesses: Map<string, ChildProcess> = new Map()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'ESPHome GUI',
    show: false,
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC Handlers

// Project Management
ipcMain.handle('project:create', async (_, projectData) => {
  try {
    const projectsDir = path.join(app.getPath('userData'), 'projects')
    await fs.mkdir(projectsDir, { recursive: true })

    const projectPath = path.join(projectsDir, projectData.id)
    await fs.mkdir(projectPath, { recursive: true })

    await fs.writeFile(
      path.join(projectPath, 'config.json'),
      JSON.stringify(projectData, null, 2)
    )

    return { success: true, path: projectPath }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('project:list', async () => {
  try {
    const projectsDir = path.join(app.getPath('userData'), 'projects')

    if (!existsSync(projectsDir)) {
      return { success: true, projects: [] }
    }

    const dirs = await fs.readdir(projectsDir)
    const projects = []

    for (const dir of dirs) {
      const configPath = path.join(projectsDir, dir, 'config.json')
      if (existsSync(configPath)) {
        const data = await fs.readFile(configPath, 'utf-8')
        projects.push(JSON.parse(data))
      }
    }

    return { success: true, projects }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('project:update', async (_, projectData) => {
  try {
    const projectPath = path.join(
      app.getPath('userData'),
      'projects',
      projectData.id
    )

    await fs.writeFile(
      path.join(projectPath, 'config.json'),
      JSON.stringify(projectData, null, 2)
    )

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('project:delete', async (_, projectId) => {
  try {
    const projectPath = path.join(
      app.getPath('userData'),
      'projects',
      projectId
    )

    await fs.rm(projectPath, { recursive: true, force: true })

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// YAML Management
ipcMain.handle('yaml:save', async (_, { projectId, yaml }) => {
  try {
    const yamlPath = path.join(
      app.getPath('userData'),
      'projects',
      projectId,
      'config.yaml'
    )

    await fs.writeFile(yamlPath, yaml, 'utf-8')

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('yaml:load', async (_, projectId) => {
  try {
    const yamlPath = path.join(
      app.getPath('userData'),
      'projects',
      projectId,
      'config.yaml'
    )

    if (!existsSync(yamlPath)) {
      return { success: true, yaml: '' }
    }

    const yaml = await fs.readFile(yamlPath, 'utf-8')

    return { success: true, yaml }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// ESPHome Build & Flash
ipcMain.handle('esphome:compile', async (_, { projectId }) => {
  try {
    const yamlPath = path.join(
      app.getPath('userData'),
      'projects',
      projectId,
      'config.yaml'
    )

    const process = spawn('esphome', ['compile', yamlPath])
    const processId = `compile-${projectId}-${Date.now()}`
    activeProcesses.set(processId, process)

    process.stdout?.on('data', (data) => {
      mainWindow?.webContents.send('esphome:log', {
        processId,
        type: 'stdout',
        data: data.toString(),
      })
    })

    process.stderr?.on('data', (data) => {
      mainWindow?.webContents.send('esphome:log', {
        processId,
        type: 'stderr',
        data: data.toString(),
      })
    })

    process.on('close', (code) => {
      mainWindow?.webContents.send('esphome:complete', {
        processId,
        code,
      })
      activeProcesses.delete(processId)
    })

    return { success: true, processId }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('esphome:upload', async (_, { projectId, port }) => {
  try {
    const yamlPath = path.join(
      app.getPath('userData'),
      'projects',
      projectId,
      'config.yaml'
    )

    const args = ['run', yamlPath]
    if (port) {
      args.push('--device', port)
    }

    const process = spawn('esphome', args)
    const processId = `upload-${projectId}-${Date.now()}`
    activeProcesses.set(processId, process)

    process.stdout?.on('data', (data) => {
      mainWindow?.webContents.send('esphome:log', {
        processId,
        type: 'stdout',
        data: data.toString(),
      })
    })

    process.stderr?.on('data', (data) => {
      mainWindow?.webContents.send('esphome:log', {
        processId,
        type: 'stderr',
        data: data.toString(),
      })
    })

    process.on('close', (code) => {
      mainWindow?.webContents.send('esphome:complete', {
        processId,
        code,
      })
      activeProcesses.delete(processId)
    })

    return { success: true, processId }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('esphome:ota', async (_, { projectId, host }) => {
  try {
    const yamlPath = path.join(
      app.getPath('userData'),
      'projects',
      projectId,
      'config.yaml'
    )

    const process = spawn('esphome', ['run', yamlPath, '--device', host])
    const processId = `ota-${projectId}-${Date.now()}`
    activeProcesses.set(processId, process)

    process.stdout?.on('data', (data) => {
      mainWindow?.webContents.send('esphome:log', {
        processId,
        type: 'stdout',
        data: data.toString(),
      })
    })

    process.stderr?.on('data', (data) => {
      mainWindow?.webContents.send('esphome:log', {
        processId,
        type: 'stderr',
        data: data.toString(),
      })
    })

    process.on('close', (code) => {
      mainWindow?.webContents.send('esphome:complete', {
        processId,
        code,
      })
      activeProcesses.delete(processId)
    })

    return { success: true, processId }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// Serial Ports
ipcMain.handle('serial:list', async () => {
  try {
    // Use esphome to list serial ports
    return new Promise((resolve) => {
      const process = spawn('python3', ['-m', 'serial.tools.list_ports'])
      let output = ''

      process.stdout?.on('data', (data) => {
        output += data.toString()
      })

      process.on('close', () => {
        const ports = output.split('\n').filter(line => line.trim())
        resolve({ success: true, ports })
      })
    })
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// Device Discovery
ipcMain.handle('device:discover', async () => {
  try {
    return new Promise((resolve) => {
      const process = spawn('esphome', ['dashboard'])
      let output = ''

      setTimeout(() => {
        process.kill()
        // Parse discovered devices from output
        resolve({ success: true, devices: [] })
      }, 5000)
    })
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// File Dialogs
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'YAML Files', extensions: ['yaml', 'yml'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const content = await fs.readFile(result.filePaths[0], 'utf-8')
    return { success: true, content, path: result.filePaths[0] }
  }

  return { success: false }
})

ipcMain.handle('dialog:saveFile', async (_, { content, defaultPath }) => {
  const result = await dialog.showSaveDialog({
    defaultPath,
    filters: [
      { name: 'YAML Files', extensions: ['yaml', 'yml'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (!result.canceled && result.filePath) {
    await fs.writeFile(result.filePath, content, 'utf-8')
    return { success: true, path: result.filePath }
  }

  return { success: false }
})

// Process Management
ipcMain.handle('process:kill', async (_, processId) => {
  const process = activeProcesses.get(processId)
  if (process) {
    process.kill()
    activeProcesses.delete(processId)
    return { success: true }
  }
  return { success: false, error: 'Process not found' }
})
