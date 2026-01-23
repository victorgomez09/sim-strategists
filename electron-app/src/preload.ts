// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('lmuAPI', {
  onConnectionUpdate: (callback: (data: any) => void) => 
    ipcRenderer.on('connection-status', (_event, value) => callback(value)),
  onSessionUpdate: (callback: (data: any) => void) => 
    ipcRenderer.on('session-update', (_event, value) => callback(value)),
  onDeltaUpdate: (callback: (data: any) => void) => 
    ipcRenderer.on('delta-update', (_event, value) => callback(value))
});