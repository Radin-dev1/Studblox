const {app,BrowserWindow,shell}=require('electron');
const path=require('node:path');
function createWindow(){const win=new BrowserWindow({width:1440,height:900,minWidth:980,minHeight:650,backgroundColor:'#0c0f0d',title:'Stud Blox',autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:\/\//.test(url))shell.openExternal(url);return{action:'deny'}});win.loadFile(path.join(__dirname,'..','dist','shell.html'))}
app.whenReady().then(()=>{createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()})});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
