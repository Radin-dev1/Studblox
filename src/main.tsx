import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import {ArrowLeft,BracketsCurly,ChatCircleDots,SignOut} from 'phosphor-react';
import type {Session} from '@supabase/supabase-js';
import {App} from './App';
import {Landing} from './Landing';
import {Workbench} from './Workbench';
import {supabase} from './lib/supabase';
import './styles.css';
import './providers.css';
import './workbench.css';
import './overlay.css';
import './landing.css';
import './back.css';
import './auth.css';
import './signout.css';
function Root(){const [inside,setInside]=useState(false),[studioMode,setStudioMode]=useState(true),[session,setSession]=useState<Session|null>(null);useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>{setSession(data.session);if(data.session)setInside(true)});const {data}=supabase.auth.onAuthStateChange((_event,next)=>{setSession(next);if(next)setInside(true)});return()=>data.subscription.unsubscribe()},[]);const signOut=async()=>{await supabase?.auth.signOut();setSession(null);setInside(false)};if(!inside)return <Landing openApp={()=>setInside(true)}/>;return <div className="mono-app"><App/><button className="back-to-site" onClick={()=>setInside(false)}><ArrowLeft/>Website</button>{session&&<button className="sign-out" onClick={signOut}><SignOut/>Sign out</button>}<button className="workspace-switch" onClick={()=>setStudioMode(v=>!v)}>{studioMode?<><ChatCircleDots/>Agent chat</>:<><BracketsCurly/>Studio tools</>}</button>{studioMode&&<div className="workbench-overlay"><Workbench/></div>}</div>}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Root/></React.StrictMode>);
