import React, { useState, useEffect } from 'react';
import { getStoredUsers, getStoredPassword, saveCustomUser, setStoredAuthUser } from '../../constants/auth';
import { dbService } from '../../services/db';
import { DatabaseModal } from '../Database/DatabaseModal';
import { Lock, User, KeyRound, ArrowRight, ShieldCheck, UserPlus, Database } from 'lucide-react';

export const LoginScreen = ({ onLoginSuccess }) => {
  const [users, setUsers] = useState(() => getStoredUsers());
  const [selectedUserId, setSelectedUserId] = useState(() => getStoredUsers()[0]?.id || '');
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Diffusion / Booking');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  const loadData = async () => {
    const fetchedUsers = await dbService.getUsers();
    if (fetchedUsers && fetchedUsers.length > 0) {
      setUsers(fetchedUsers);
      if (!selectedUserId) {
        setSelectedUserId(fetchedUsers[0].id);
      }
    }
    const status = await dbService.checkStatus();
    setDbStatus(status);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const storedPass = getStoredPassword();
    if (password !== storedPass) {
      setError('Mot de passe incorrect. (Par défaut : vrack)');
      return;
    }

    let authenticatedUser;
    if (isNewUser) {
      if (!newUserName.trim()) {
        setError('Veuillez saisir votre prénom.');
        return;
      }
      authenticatedUser = await dbService.saveUser({ name: newUserName.trim(), role: newUserRole });
    } else {
      authenticatedUser = users.find(u => u.id === selectedUserId) || users[0];
    }

    setStoredAuthUser(authenticatedUser);
    onLoginSuccess(authenticatedUser);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black overflow-hidden">
      {/* Database configuration modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onConfigUpdated={loadData}
      />
      {/* Background image VRACK with dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter brightness-75 contrast-110 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: "url('/images/photo_groupe.png')" }}
      />
      {/* Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[#121110]/80 to-[#0e0d0c]/95" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#181614]/90 backdrop-blur-xl border border-[#42382c]/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 shadow-black/80">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 items-center justify-center shadow-lg shadow-amber-500/20 text-black font-extrabold text-2xl font-display mb-1">
            V
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            VRACK Admin
          </h1>
          <p className="text-xs text-[#a09483]">
            Portail administratif de l'association « La Sauce en Vrac »
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* User selector or new user */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#c4b9a9] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Qui êtes-vous ?</span>
              </label>
              <button
                type="button"
                onClick={() => setIsNewUser(!isNewUser)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline"
              >
                {isNewUser ? '← Choisir un profil existant' : '+ Nouveau membre'}
              </button>
            </div>

            {isNewUser ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Votre prénom ou nom..."
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-[#121110] border border-[#3d352b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Votre rôle (ex: Booking, Musique, Trésorier...)"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-[#121110] border border-[#3d352b] rounded-xl px-3.5 py-2 text-xs text-[#c4b9a9] focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-[#121110] border border-[#3d352b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#1c1a17]">
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#c4b9a9] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Mot de passe d'accès</span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Mot de passe association..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-[#121110] border border-[#3d352b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <p className="text-[11px] text-[#796f60]">
              Mot de passe partagé de l'association (par défaut : <code className="text-amber-400 font-mono">vrack</code>)
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <span>Accéder au site d'administration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#2d2822] flex items-center justify-between text-[11px] text-[#796f60]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>La Sauce en Vrac</span>
          </span>
          <button
            type="button"
            onClick={() => setIsDbModalOpen(true)}
            className="flex items-center gap-1 text-amber-400 hover:underline"
          >
            <Database className="w-3 h-3" />
            <span>{dbStatus?.connected ? 'PostgreSQL Connecté' : 'Config BDD'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
