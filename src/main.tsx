import React,{useState} from 'react';
import ReactDOM from 'react-dom/client';
import {BracketsCurly,ChatCircleDots} from 'phosphor-react';
import {App} from './App';
import {Workbench} from './Workbench';
import './styles.css';
import './providers.css';
import './workbench.css';
import './overlay.css';
function Root(){const [studioMode,setStudioMode]=useState(true);return <><App/><button className="workspace-switch" onClick={()=>setStudioMode(v=>!v)}>{studioMode?<><ChatCircleDots/>Agent chat</>:<><BracketsCurly/>Studio tools</>}</button>{studioMode&&<div className="workbench-overlay"><Workbench/></div>}</>}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Root/></React.StrictMode>);
