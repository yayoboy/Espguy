import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export interface Project {
  id: string
  name: string
  description: string
  board: string
  platform: string
  createdAt: string
  updatedAt: string
  category?: string
}

export interface ESPHomeAPI {
  // Project Management
  project: {
    create: (data: Partial<Project>) => Promise<any>
    list: () => Promise<any>
    update: (data: Project) => Promise<any>
    delete: (id: string) => Promise<any>
  }

  // YAML Management
  yaml: {
    save: (projectId: string, yaml: string) => Promise<any>
    load: (projectId: string) => Promise<any>
  }

  // ESPHome Operations
  esphome: {
    compile: (projectId: string) => Promise<any>
    upload: (projectId: string, port?: string) => Promise<any>
    ota: (projectId: string, host: string) => Promise<any>
    onLog: (callback: (data: any) => void) => () => void
    onComplete: (callback: (data: any) => void) => () => void
  }

  // Serial Ports
  serial: {
    list: () => Promise<any>
  }

  // Device Discovery
  device: {
    discover: () => Promise<any>
  }

  // File Dialogs
  dialog: {
    openFile: () => Promise<any>
    saveFile: (content: string, defaultPath?: string) => Promise<any>
  }

  // Process Management
  process: {
    kill: (processId: string) => Promise<any>
  }
}

const api: ESPHomeAPI = {
  project: {
    create: (data) => ipcRenderer.invoke('project:create', data),
    list: () => ipcRenderer.invoke('project:list'),
    update: (data) => ipcRenderer.invoke('project:update', data),
    delete: (id) => ipcRenderer.invoke('project:delete', id),
  },

  yaml: {
    save: (projectId, yaml) => ipcRenderer.invoke('yaml:save', { projectId, yaml }),
    load: (projectId) => ipcRenderer.invoke('yaml:load', projectId),
  },

  esphome: {
    compile: (projectId) => ipcRenderer.invoke('esphome:compile', { projectId }),
    upload: (projectId, port) => ipcRenderer.invoke('esphome:upload', { projectId, port }),
    ota: (projectId, host) => ipcRenderer.invoke('esphome:ota', { projectId, host }),
    onLog: (callback) => {
      const listener = (_: IpcRendererEvent, data: any) => callback(data)
      ipcRenderer.on('esphome:log', listener)
      return () => ipcRenderer.removeListener('esphome:log', listener)
    },
    onComplete: (callback) => {
      const listener = (_: IpcRendererEvent, data: any) => callback(data)
      ipcRenderer.on('esphome:complete', listener)
      return () => ipcRenderer.removeListener('esphome:complete', listener)
    },
  },

  serial: {
    list: () => ipcRenderer.invoke('serial:list'),
  },

  device: {
    discover: () => ipcRenderer.invoke('device:discover'),
  },

  dialog: {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (content, defaultPath) => ipcRenderer.invoke('dialog:saveFile', { content, defaultPath }),
  },

  process: {
    kill: (processId) => ipcRenderer.invoke('process:kill', processId),
  },
}

contextBridge.exposeInMainWorld('electronAPI', api)

declare global {
  interface Window {
    electronAPI: ESPHomeAPI
  }
}
