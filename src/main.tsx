import React,{useState} from 'react';
import ReactDOM from 'react-dom/client';
import {ArrowLeft,BracketsCurly,ChatCircleDots} from 'phosphor-react';
import {App} from './App';
import {Landing} from './Landing';
import {Workbench} from './Workbench';
import './styles.css';
import './providers.css';
import './workbench.css';
import './overlay.css';
import './landing.css';
import './back.css';
function Root(){const [inside,setInside]=useState(false),[studioMode,setStudioMode]=useState(true);if(!inside)return <Landing openApp={()=>setInside(true)}/>;return <div className="mono-app"><App/><button className="back-to-site" onClick={()=>setInside(false)}><ArrowLeft/>Website</button><button className="workspace-switch" onClick={()=>setStudioMode(v=>!v)}>{studioMode?<><ChatCircleDots/>Agent chat</>:<><BracketsCurly/>Studio tools</>}</button>{studioMode&&<div className="workbench-overlay"><Workbench/></div>}</div>}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Root/></React.StrictMode>);
