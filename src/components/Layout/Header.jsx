import React from 'react';
import { FileText, Mail, Image, History, Music, Sparkles, User, LogOut, Shield } from 'lucide-react';

export const Header = ({
  activeTab,
  setActiveTab,
  savedCount = 0,
  currentUser,
  onLogout,
  currentGroupName = 'VRACK'
}) => {
  const tabs = [
    { id: 'devis', label: 'Créateur de Devis', icon: FileText, badge: null },
    { id: 'mail', label: 'Mail de Proposition', icon: Mail, badge: 'Auto' },
    { id: 'media', label: 'Photos & Kit Promo', icon: Image, badge: null },
    { id: 'history', label: 'Historique', icon: History, badge: savedCount > 0 ? savedCount : null },
  ];

  return (
    <header className="no-print border-b border-[#2d2822] bg-[#181614]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('devis')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black font-extrabold text-xl font-display">
              {currentGroupName ? currentGroupName[0] : 'V'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold font-display tracking-tight text-[#f5efe6]">
                  {currentGroupName || 'VRACK'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  La Sauce en Vrac
                </span>
              </div>
              <p className="text-xs text-[#9d9385] hidden lg:block">
                Association productrice • Devis & Booking
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-semibold'
                      : 'text-[#bbb0a0] hover:text-[#f5efe6] hover:bg-[#25211c]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-black/20 text-black'
                          : 'bg-amber-400/20 text-amber-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser && (
              <div className="flex items-center gap-2 bg-[#221e1a] border border-[#383127] rounded-xl px-2.5 py-1 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                  {currentUser.name[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-[#8d8272] leading-tight">{currentUser.role || 'Membre'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1 hover:text-red-400 text-[#8d8272] transition ml-1"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
