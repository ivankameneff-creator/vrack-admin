import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { DevisForm } from './components/Devis/DevisForm';
import { DevisPreview } from './components/Devis/DevisPreview';
import { MailGenerator } from './components/MailProposal/MailGenerator';
import { PhotoGallery } from './components/MediaKit/PhotoGallery';
import { DevisList } from './components/History/DevisList';
import { LoginScreen } from './components/Auth/LoginScreen';
import { DatabaseModal } from './components/Database/DatabaseModal';
import { getDefaultDevis, generateDevisNumber } from './utils/formatters';
import { getStoredAuthUser, setStoredAuthUser, DEFAULT_USERS } from './constants/auth';
import { GROUPS_LIST } from './constants/groups';
import { dbService } from './services/db';
import { printDevis, downloadPdfDirect } from './utils/pdfExport';
import { Eye, Edit3, Printer, Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => getStoredAuthUser());

  const [activeTab, setActiveTab] = useState('devis');
  
  // Database & collections state
  const [groupsList, setGroupsList] = useState(GROUPS_LIST);
  const [usersList, setUsersList] = useState(DEFAULT_USERS);
  const [savedDevisList, setSavedDevisList] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Devis state
  const [devis, setDevis] = useState(() => {
    const savedDraft = localStorage.getItem('vrack_current_devis_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (!parsed.group) {
          parsed.group = { id: 'vrack', name: 'VRACK', baseline: 'Musiques tziganes festives — 11 musiciens' };
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return getDefaultDevis(currentUser);
  });

  // View mode in Devis tab for responsive screens ('split', 'form', 'preview')
  const [devisViewMode, setDevisViewMode] = useState('split');
  
  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load data from database (Supabase or Local)
  const loadDatabaseData = async () => {
    try {
      const [groups, users, devisData, status] = await Promise.all([
        dbService.getGroups(),
        dbService.getUsers(),
        dbService.getDevisList(),
        dbService.checkStatus()
      ]);

      if (groups && groups.length > 0) setGroupsList(groups);
      if (users && users.length > 0) setUsersList(users);
      if (devisData) setSavedDevisList(devisData);
      setDbStatus(status);
    } catch (err) {
      console.error('Erreur chargement base de données :', err);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Auto-save draft on change
  useEffect(() => {
    localStorage.setItem('vrack_current_devis_draft', JSON.stringify(devis));
  }, [devis]);

  // Handle Login & Logout
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (!devis.createdBy || !devis.createdBy.name) {
      setDevis(prev => ({
        ...prev,
        createdBy: { id: user.id, name: user.name, role: user.role }
      }));
    }
    loadDatabaseData();
    showToast(`Bienvenue, ${user.name} !`);
  };

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vous déconnecter du portail administratif ?')) {
      setStoredAuthUser(null);
      setCurrentUser(null);
      showToast('Déconnexion réussie');
    }
  };

  // Actions
  const handleSaveDevis = async () => {
    const quoteWithCreator = {
      ...devis,
      createdBy: devis.createdBy || { name: currentUser?.name || 'Yann', role: currentUser?.role || 'Membre' },
      updatedAt: new Date().toISOString()
    };

    try {
      await dbService.saveDevis(quoteWithCreator);
      const updatedList = await dbService.getDevisList();
      setSavedDevisList(updatedList);
      showToast(`Devis n° ${devis.number} (${devis.group?.name || 'VRACK'}) enregistré en base !`);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la sauvegarde du devis', 'info');
    }
  };

  const handlePrint = () => {
    printDevis();
  };

  const handleDownloadPdf = async () => {
    showToast('Génération du fichier PDF en cours...', 'info');
    const groupPrefix = devis.group?.name ? devis.group.name.replace(/\s+/g, '_') : 'VRACK';
    await downloadPdfDirect('devis-printable-area', `Devis_${groupPrefix}_${devis.number}.pdf`);
  };

  const handleReset = () => {
    if (window.confirm('Voulez-vous réinitialiser le formulaire avec un nouveau devis vierge ?')) {
      const newDevis = getDefaultDevis(currentUser, devis.group);
      newDevis.number = generateDevisNumber(savedDevisList.length);
      setDevis(newDevis);
      showToast('Nouveau devis initialisé');
    }
  };

  const handleLoadDevis = (selectedDevis) => {
    setDevis(selectedDevis);
    setActiveTab('devis');
    showToast(`Devis n° ${selectedDevis.number} (${selectedDevis.group?.name || 'VRACK'}) chargé`);
  };

  const handleDuplicateDevis = async (originalDevis) => {
    const duplicated = {
      ...originalDevis,
      id: `devis-${Date.now()}`,
      number: generateDevisNumber(savedDevisList.length),
      date: new Date().toISOString().split('T')[0],
      createdBy: { name: currentUser?.name || 'Yann', role: currentUser?.role || 'Membre' },
      status: 'Brouillon'
    };
    await dbService.saveDevis(duplicated);
    const updated = await dbService.getDevisList();
    setSavedDevisList(updated);
    setDevis(duplicated);
    setActiveTab('devis');
    showToast(`Devis dupliqué sous le numéro ${duplicated.number} !`);
  };

  const handleDeleteDevis = async (devisId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis de la base de données ?')) {
      await dbService.deleteDevis(devisId);
      const updated = await dbService.getDevisList();
      setSavedDevisList(updated);
      showToast('Devis supprimé de la base');
    }
  };

  const handleGoToMailWithDevis = (selectedDevis = null) => {
    if (selectedDevis) {
      setDevis(selectedDevis);
    }
    setActiveTab('mail');
  };

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedDevisList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sauvegarde_devis_vrack_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Sauvegarde exportée avec succès !');
  };

  const handleImportAll = async (importedList) => {
    for (const d of importedList) {
      await dbService.saveDevis(d);
    }
    const updated = await dbService.getDevisList();
    setSavedDevisList(updated);
    showToast(`${importedList.length} devis synchronisés en base de données !`);
  };

  // If not logged in, show Password/Account Login Gate
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121110] text-[#f3efe6]">
      {/* Toast Notification */}
      {toast && (
        <div className="no-print fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#221e1a] border border-amber-500/40 text-white shadow-2xl animate-fade-in text-xs font-semibold">
          {toast.type === 'info' ? (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Database Modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onConfigUpdated={loadDatabaseData}
      />

      {/* Main App Header with User Profile and Group Name */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedDevisList.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentGroupName={devis.group?.name || 'VRACK'}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: DEVIS CREATOR */}
        {activeTab === 'devis' && (
          <div className="space-y-4">
            {/* View Mode Toggle on Mobile / Medium Screens */}
            <div className="no-print flex lg:hidden items-center justify-center gap-2 bg-[#1c1a17] p-1.5 rounded-xl border border-[#332c24] max-w-xs mx-auto">
              <button
                onClick={() => setDevisViewMode('form')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  devisViewMode === 'form' ? 'bg-amber-500 text-black' : 'text-[#a09483]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Formulaire
              </button>
              <button
                onClick={() => setDevisViewMode('preview')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  devisViewMode === 'preview' ? 'bg-amber-500 text-black' : 'text-[#a09483]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Aperçu A4
              </button>
            </div>

            {/* Split Grid for Devis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form */}
              <div
                className={`no-print lg:col-span-6 ${
                  devisViewMode === 'preview' ? 'hidden lg:block' : 'block'
                }`}
              >
                <DevisForm
                  devis={devis}
                  setDevis={setDevis}
                  onSave={handleSaveDevis}
                  onPrint={handlePrint}
                  onDownloadPdf={handleDownloadPdf}
                  onGoToMail={() => handleGoToMailWithDevis(devis)}
                  onReset={handleReset}
                  groups={groupsList}
                  usersList={usersList}
                />
              </div>

              {/* Right Column: Live A4 Preview */}
              <div
                className={`lg:col-span-6 flex flex-col items-center ${
                  devisViewMode === 'form' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div className="no-print w-full flex items-center justify-between pb-3 text-xs text-[#a09483]">
                  <span className="flex items-center gap-1 font-medium">
                    <Eye className="w-3.5 h-3.5 text-amber-500" />
                    Aperçu Haute Définition A4 ({devis.group?.name || 'VRACK'})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#26211c] hover:bg-[#342d25] text-amber-400 border border-[#3b3329] rounded-lg transition font-medium"
                      title="Imprimer ou enregistrer en PDF avec styles vectoriels"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Imprimer
                    </button>
                    <button
                      onClick={handleDownloadPdf}
                      className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition font-semibold"
                      title="Télécharger le fichier PDF directement"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Télécharger PDF
                    </button>
                  </div>
                </div>

                <div className="w-full overflow-x-auto flex justify-center pb-8">
                  <DevisPreview devis={devis} id="devis-printable-area" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPOSAL EMAIL GENERATOR */}
        {activeTab === 'mail' && (
          <MailGenerator
            devis={devis}
            onGoToPhotos={() => setActiveTab('media')}
          />
        )}

        {/* TAB 3: PHOTOS & MEDIA KIT */}
        {activeTab === 'media' && <PhotoGallery />}

        {/* TAB 4: DEVIS HISTORY */}
        {activeTab === 'history' && (
          <DevisList
            savedDevisList={savedDevisList}
            onLoadDevis={handleLoadDevis}
            onDuplicateDevis={handleDuplicateDevis}
            onDeleteDevis={handleDeleteDevis}
            onGoToMail={handleGoToMailWithDevis}
            onExportAll={handleExportAll}
            onImportAll={handleImportAll}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-[#26211c] py-5 mt-10 bg-[#151311] text-center text-xs text-[#796f60]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {devis.group?.name || 'VRACK'} Admin • Association « La Sauce en Vrac » • Toulouse
          </p>
          <p className="flex items-center gap-3">
            <span>SIRET : 442 275 632 00010</span>
            <span>•</span>
            <a
              href="https://www.vrack.fr"
              target="_blank"
              rel="noreferrer"
              className="text-amber-500 hover:underline"
            >
              www.vrack.fr
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
