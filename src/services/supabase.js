import { createClient } from '@supabase/supabase-js';

// Récupération depuis les variables d'environnement ou le localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env?.SUPABASE_URL;
  const envKey = import.meta.env?.SUPABASE_ANON_KEY;
  
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('vrack_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('vrack_supabase_key') : null;

  const url = (envUrl && !envUrl.includes('votre-projet')) ? envUrl : localUrl;
  const key = (envKey && !envKey.includes('votre-cle')) ? envKey : localKey;

  return {
    url: url?.trim() || '',
    key: key?.trim() || '',
    isConfigured: Boolean(url && key && url.startsWith('http') && key.length > 20)
  };
};

let clientInstance = null;

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }

  return clientInstance;
};

export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('vrack_supabase_url', url.trim());
    localStorage.setItem('vrack_supabase_key', key.trim());
    clientInstance = null; // Réinitialise l'instance
    return true;
  }
  return false;
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('vrack_supabase_url');
  localStorage.removeItem('vrack_supabase_key');
  clientInstance = null;
};
