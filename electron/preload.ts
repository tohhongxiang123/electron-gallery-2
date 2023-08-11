import { ipcRenderer } from 'electron'

process.once('loaded', () => {
  window.addEventListener('message', event => {
    if (event.data.type === 'select-directory') {
      ipcRenderer.send('select-directory')
    }
  })
})
