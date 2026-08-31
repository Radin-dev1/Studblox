import {createClient,type Provider} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
export const supabase=url&&publishableKey?createClient(url,publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
export const authConfigured=Boolean(supabase);
export const oauthProviders=['google','github','discord'] as const satisfies readonly Provider[];
export async function signInWithProvider(provider:(typeof oauthProviders)[number]){if(!supabase)throw new Error('Supabase environment variables are not configured.');const {error}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo:window.location.origin+window.location.pathname}});if(error)throw error}
