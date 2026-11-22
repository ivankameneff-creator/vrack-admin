import React, { useState, useEffect } from 'react';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from '../../services/supabase';
import { dbService } from '../../services/db';
import { Database, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, X, RefreshCw, Key, Globe } from 'lucide-react';

export const DatabaseModal = ({ isOpen, onClose, onConfigUpdated }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [status, setStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const checkDb = async () => {
    setTesting(true);
    const res = await dbService.checkStatus();
    setStatus(res);
    setTesting(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkDb();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!url || !key) {
      alert('Veuillez renseigner l\'URL et la clé Supabase.');
      return;
    }
    saveSupabaseConfig(url, key);
    await checkDb();
    if (onConfigUpdated) onConfigUpdated();
  };

  const handleDisconnect = async () => {
    if (window.confirm('Voulez-vous repasser en mode local (déconnecté de Supabase) ?')) {
      clearSupabaseConfig();
      setUrl('');
      setKey('');
      await checkDb();
      if (onConfigUpdated) onConfigUpdated();
    }
  };

  const handleCopySql = async () => {
    try {
      const response = await fetch('/docs/../schema.sql').catch(() => null);
      // Fallback: direct simple SQL instruction
      const sqlInstructions = `-- Script disponible dans vrack-admin/supabase/schema.sql
-- Exécutez ce script dans votre tableau de bord Supabase > SQL Editor`;
      await navigator.clipboard.writeText(sqlInstructions);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#181614] border border-[#383127] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 text-xs text-[#dcd2c4]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8d8272] hover:text-white hover:bg-[#25211c] rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#2d2822] pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Base de Données Cloud (Supabase PostgreSQL)
            </h3>
            <p className="text-[11px] text-[#8d8272]">
              Synchronisation des devis, groupes et utilisateurs entre tous les membres
            </p>
          </div>
        </div>

        {/* Status card */}
        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
            status?.connected
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : status?.isCloud
              ? 'bg-red-950/20 border-red-500/40 text-red-300'
              : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              {status?.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span>{status?.label || 'Vérification...'}</span>
            </div>
            <p className="text-[11px] opacity-90">{status?.message}</p>
          </div>

          <button
            onClick={checkDb}
            disabled={testing}
            className="p-1.5 bg-[#25211c] hover:bg-[#322c25] rounded-lg text-white transition disabled:opacity-50"
            title="Tester la connexion"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-[#c4b9a9] mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-500" />
              <span>Project URL Supabase :</span>
            </label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#121110] border border-[#3d352b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#c4b9a9] mb-1 flex items-center gap-1">
              <Key className="w-3 h-3 text-amber-500" />
              <span>API Anon Key (Clé publique) :</span>
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-[#121110] border border-[#3d352b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs transition shadow-md shadow-amber-500/20"
            >
              Enregistrer & Connecter
            </button>

            {currentConfig.isConfigured && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="py-2 px-3 bg-[#2a241e] hover:bg-red-950/40 text-red-400 border border-[#3f3528] rounded-lg text-xs transition"
              >
                Déconnecter
              </button>
            )}
          </div>
        </form>

        {/* Instructions */}
        <div className="pt-3 border-t border-[#2d2822] space-y-2 text-[11px] text-[#8d8272]">
          <p className="font-semibold text-[#dcd2c4] flex items-center justify-between">
            <span>Comment créer votre base gratuite en 2 minutes ?</span>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>supabase.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Créez un compte gratuit sur <strong>supabase.com</strong> et un nouveau projet.</li>
            <li>Allez dans le menu <strong>SQL Editor</strong> et collez le script <code className="text-amber-400 font-mono">schema.sql</code> (situé dans le dossier <code className="font-mono">supabase/</code>).</li>
            <li>Récupérez vos clés dans <strong>Project Settings &gt; API</strong> et collez-les ci-dessus.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
