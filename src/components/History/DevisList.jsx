import React, { useState } from 'react';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import { Search, Edit3, Copy, Trash2, Mail, Download, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const DevisList = ({
  savedDevisList,
  onLoadDevis,
  onDuplicateDevis,
  onDeleteDevis,
  onGoToMail,
  onExportAll,
  onImportAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  const filteredList = savedDevisList.filter((item) => {
    const matchesSearch =
      (item.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.client?.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.event?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.group?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.createdBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesGroup = groupFilter === 'all' || (item.group?.id || 'vrack') === groupFilter;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onImportAll(parsed);
        } else {
          alert('Format de fichier JSON invalide.');
        }
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header & Backup Controls */}
      <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Historique des Devis & Propositions ({savedDevisList.length})
          </h2>
          <p className="text-xs text-[#a09483] mt-1">
            Tous les devis créés sont conservés localement sur votre appareil. Vous pouvez les recharger, les dupliquer ou les exporter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportAll}
            disabled={savedDevisList.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#2a2520] hover:bg-[#38312b] text-[#f0e8db] border border-[#3d352b] rounded-lg transition disabled:opacity-40"
            title="Exporter l'historique complet en fichier JSON pour sauvegarde"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Exporter JSON
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#2a2520] hover:bg-[#38312b] text-[#f0e8db] border border-[#3d352b] rounded-lg transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            Importer JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="space-y-3 bg-[#171513] p-3 rounded-xl border border-[#2b251f]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#796f60] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par client, créateur, ville, n°..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Group filters */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] text-[#796f60] mr-1 hidden sm:inline">Groupe :</span>
            {[
              { id: 'all', label: 'Tous' },
              { id: 'vrack', label: 'VRACK' },
              { id: 'anyatra', label: 'ANYATRA' },
              { id: 'tomake', label: 'TOMAKÉ' },
              { id: 'dosmoz', label: 'DOSMOZ' },
              { id: 'dmbs', label: "DMB'S" },
              { id: 'yoyu', label: 'YOYU' },
              { id: '34s', label: '34S' },
            ].map((grp) => (
              <button
                key={grp.id}
                onClick={() => setGroupFilter(grp.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                  groupFilter === grp.id
                    ? 'bg-amber-500 text-black border-amber-500 font-bold'
                    : 'bg-[#1c1a17] text-[#9f9485] border-[#2e2720] hover:text-white'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#24201a] overflow-x-auto">
          <span className="text-[11px] text-[#796f60] mr-1">Statut :</span>
          {['all', 'Brouillon', 'Envoyé', 'Accepté', 'Refusé'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-[11px] px-2 py-0.5 rounded-lg border transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#3d3326] text-amber-300 border-amber-500/50 font-semibold'
                  : 'bg-[#141210] text-[#807667] border-[#25201a] hover:text-[#bbb0a0]'
              }`}
            >
              {st === 'all' ? 'Tous les statuts' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List */}
      {filteredList.length === 0 ? (
        <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-12 text-center space-y-3">
          <p className="text-zinc-400 text-sm">
            {savedDevisList.length === 0
              ? "Aucun devis n'a encore été enregistré."
              : 'Aucun devis ne correspond à votre recherche.'}
          </p>
          <p className="text-xs text-[#796f60]">
            Rendez-vous sur l'onglet "Créateur de Devis" pour composer votre premier devis et cliquez sur "Enregistrer".
          </p>
        </div>
      ) : (
        <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141210] border-b border-[#2d2822] text-[#9f9485] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">N° Devis</th>
                <th className="py-3 px-4">Groupe</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Organisateur / Client</th>
                <th className="py-3 px-4">Événement & Lieu</th>
                <th className="py-3 px-4">Créateur</th>
                <th className="py-3 px-4 text-right">Montant Net</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26211c]">
              {filteredList.map((item) => {
                const total =
                  item.items.reduce(
                    (acc, i) => acc + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
                    0
                  ) - (Number(item.discount) || 0);

                return (
                  <tr key={item.id} className="hover:bg-[#221e1a] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {item.number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {item.group?.name || 'VRACK'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#8f8474]">
                      {formatDateShort(item.date)}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{item.client?.name || 'Sans nom'}</p>
                      {item.client?.city && (
                        <p className="text-[10px] text-[#796f60]">{item.client.city}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-[#dcd2c4]">{item.event?.name || 'Concert'}</p>
                      {item.event?.date && (
                        <p className="text-[10px] text-[#796f60]">Prévu le : {formatDateShort(item.event.date)}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-amber-300/90">
                        {item.createdBy?.name || 'Yann'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {formatCurrency(Math.max(0, total))}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          item.status === 'Accepté'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'Envoyé'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : item.status === 'Refusé'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-zinc-700/30 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {item.status || 'Brouillon'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onLoadDevis(item)}
                          className="p-1.5 bg-[#2a241e] hover:bg-amber-500 hover:text-black text-amber-400 rounded-lg transition"
                          title="Modifier / Charger ce devis"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateDevis(item)}
                          className="p-1.5 bg-[#2a241e] hover:bg-[#38312b] text-[#dcd2c4] rounded-lg transition"
                          title="Dupliquer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onGoToMail(item)}
                          className="p-1.5 bg-[#2a241e] hover:bg-emerald-600 hover:text-white text-emerald-400 rounded-lg transition"
                          title="Générer l'email pour ce devis"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDevis(item.id)}
                          className="p-1.5 bg-[#2a241e] hover:bg-red-600 hover:text-white text-red-400 rounded-lg transition"
                          title="Supprimer de l'historique"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
