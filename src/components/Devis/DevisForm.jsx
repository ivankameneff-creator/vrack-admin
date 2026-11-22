import React from 'react';
import { Plus, Trash2, Save, Printer, Download, Mail, RotateCcw, Calendar, User, Users, MapPin, Euro, Sparkles, Music, UserCheck } from 'lucide-react';
import { GROUPS_LIST } from '../../constants/groups';
import { getStoredUsers } from '../../constants/auth';

export const DevisForm = ({
  devis,
  setDevis,
  onSave,
  onPrint,
  onDownloadPdf,
  onGoToMail,
  onReset,
  groups = GROUPS_LIST,
  usersList = null
}) => {
  const users = usersList && usersList.length > 0 ? usersList : getStoredUsers();

  const handleGroupSelect = (group) => {
    const musicians = group.defaultMusicians || devis.event.musiciansCount || 11;
    const duration = group.defaultDuration || '1h30';
    setDevis(prev => {
      const updatedItems = prev.items.map((item, idx) => {
        if (idx === 0) {
          return {
            ...item,
            description: `Intervention musicale du groupe ${group.name} (${musicians} musiciens) - ${group.genre || 'Concert live'} (${duration})`
          };
        }
        return item;
      });

      return {
        ...prev,
        group: {
          id: group.id,
          name: group.name,
          baseline: group.baseline,
          genre: group.genre
        },
        event: {
          ...prev.event,
          musiciansCount: musicians,
          timeSlot: `Concert (${duration})`
        },
        items: updatedItems,
        notes: `Le repas chaud pour ${musicians} musiciens et l'hébergement/loges si nécessaire sont à la charge de l'organisateur. Fiche technique fournie en annexe.`
      };
    });
  };

  const handleCreatorSelect = (userName) => {
    setDevis(prev => ({
      ...prev,
      createdBy: {
        ...(prev.createdBy || {}),
        name: userName
      }
    }));
  };
  const updateField = (section, field, value) => {
    if (section) {
      setDevis(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setDevis(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleMusiciansCountChange = (count) => {
    const num = Math.max(1, Number(count) || 1);

    setDevis(prev => {
      // Met à jour la description de la prestation si elle mentionne le nombre de musiciens
      const updatedItems = prev.items.map(item => {
        if (item.description.includes('musiciens')) {
          return {
            ...item,
            description: item.description.replace(/\(\d+\s*musiciens\)/i, `(${num} musiciens)`)
          };
        }
        return item;
      });

      // Met à jour les notes d'accueil (repas) si elles mentionnent le nombre de musiciens / personnes
      let updatedNotes = prev.notes;
      if (updatedNotes && (updatedNotes.includes('musiciens') || updatedNotes.includes('personnes'))) {
        updatedNotes = updatedNotes
          .replace(/pour\s+\d+\s+musiciens/gi, `pour ${num} musiciens`)
          .replace(/pour\s+\d+\s+personnes/gi, `pour ${num} personnes`);
      }

      return {
        ...prev,
        event: {
          ...prev.event,
          musiciansCount: num
        },
        items: updatedItems,
        notes: updatedNotes
      };
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...devis.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value
    };
    setDevis(prev => ({ ...prev, items: newItems }));
  };

  const addItem = (custom = null) => {
    const newItem = custom || {
      id: Date.now().toString(),
      description: 'Prestation supplémentaire ou option',
      quantity: 1,
      unitPrice: 200
    };
    setDevis(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index) => {
    if (devis.items.length <= 1) return;
    const newItems = devis.items.filter((_, i) => i !== index);
    setDevis(prev => ({ ...prev, items: newItems }));
  };

  // Preset quick items
  const quickPresets = [
    {
      description: 'Frais de déplacement et défraiement kilométrique (Toulouse A/R)',
      quantity: 1,
      unitPrice: 150
    },
    {
      description: 'Mise à disposition système sonorisation façade et retours autonome',
      quantity: 1,
      unitPrice: 300
    },
    {
      description: 'Deuxième set / Animation déambulatoire acoustique (45 min)',
      quantity: 1,
      unitPrice: 400
    }
  ];

  return (
    <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      {/* Title & Quick actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d2822]">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            Édition du Devis Concert
          </h2>
          <p className="text-xs text-[#a09483]">
            Remplissez les détails du client et de la date. Le document et le mail se synchronisent en direct.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition shadow-md shadow-amber-500/20"
            title="Sauvegarder dans le navigateur"
          >
            <Save className="w-3.5 h-3.5" />
            Enregistrer
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#2a2520] hover:bg-[#38312b] text-[#f0e8db] rounded-lg transition border border-[#3d352b]"
            title="Imprimer ou enregistrer en PDF via le navigateur"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            Imprimer / PDF
          </button>
          <button
            onClick={onGoToMail}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-md shadow-emerald-600/20"
            title="Générer le mail de proposition lié à ce devis"
          >
            <Mail className="w-3.5 h-3.5" />
            Créer le Mail
          </button>
          <button
            onClick={onReset}
            className="p-1.5 text-xs text-[#8d8272] hover:text-[#d4c8b8] hover:bg-[#25211c] rounded-lg transition"
            title="Réinitialiser le formulaire"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 0: Groupe représenté & Créateur du devis */}
      <div className="bg-[#141210] border border-[#2e2720] rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Groupe représenté */}
          <div>
            <label className="block text-xs font-semibold text-[#f0e8db] mb-2 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-amber-500" />
              <span>Groupe représenté pour ce devis :</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {groups.map((grp) => {
                const isSelected = (devis.group?.id || 'vrack') === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => handleGroupSelect(grp)}
                    className={`py-2 px-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                        : 'bg-[#1c1a17] text-[#bbb0a0] border-[#332c24] hover:text-white hover:bg-[#25211c]'
                    }`}
                  >
                    <span className="text-xs">{grp.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-black/80' : 'text-[#7d7363]'}`}>
                      {grp.defaultMusicians} mus.
                    </span>
                  </button>
                );
              })}
            </div>
            {devis.group?.id === 'autre' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Nom personnalisé du groupe / projet..."
                  value={devis.group?.name || ''}
                  onChange={(e) => {
                    const customName = e.target.value;
                    setDevis(prev => ({
                      ...prev,
                      group: {
                        ...(prev.group || {}),
                        id: 'autre',
                        name: customName
                      }
                    }));
                  }}
                  className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>
            )}
          </div>

          {/* Créateur du devis */}
          <div>
            <label className="block text-xs font-semibold text-[#f0e8db] mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Créateur du devis (signataire) :</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={devis.createdBy?.name || users[0]?.name || 'Yann'}
                onChange={(e) => handleCreatorSelect(e.target.value)}
                className="flex-1 bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.name} className="bg-[#1c1a17]">
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <div className="px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[11px] font-mono shrink-0">
                {devis.createdBy?.name || 'Yann'}
              </div>
            </div>
            <p className="text-[10px] text-[#796f60] mt-1.5">
              Ce nom apparaîtra sur l'aperçu du devis, dans l'historique et en signature des emails.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Numéro & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#c4b9a9] mb-1">
            Numéro de Devis
          </label>
          <input
            type="text"
            value={devis.number}
            onChange={(e) => updateField(null, 'number', e.target.value)}
            className="w-full bg-[#141210] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            placeholder="Ex: 26D01"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#c4b9a9] mb-1">
            Date d'émission
          </label>
          <input
            type="date"
            value={devis.date}
            onChange={(e) => updateField(null, 'date', e.target.value)}
            className="w-full bg-[#141210] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#c4b9a9] mb-1">
            Validité (jours)
          </label>
          <input
            type="number"
            value={devis.validityDays}
            onChange={(e) => updateField(null, 'validityDays', Number(e.target.value))}
            className="w-full bg-[#141210] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            min="15"
            max="120"
          />
        </div>
      </div>

      {/* Section 2: Destinataire / Organisateur */}
      <div className="bg-[#151311] border border-[#2b251f] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-display">
          <User className="w-4 h-4" />
          <span>Organisateur / Structure cliente</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Nom ou Raison Sociale *</label>
            <input
              type="text"
              value={devis.client.name}
              onChange={(e) => updateField('client', 'name', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="Ex: Festival Les Nuits Balkaniques / Mairie de..."
            />
          </div>
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Nom du contact / Responsable</label>
            <input
              type="text"
              value={devis.client.contactPerson}
              onChange={(e) => updateField('client', 'contactPerson', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="Ex: Jean Dupont (Programmateur)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs text-[#a09483] mb-1">Adresse postale</label>
            <input
              type="text"
              value={devis.client.address}
              onChange={(e) => updateField('client', 'address', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="12 Place de la République"
            />
          </div>
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Ville & Code Postal</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={devis.client.postalCode}
                onChange={(e) => updateField('client', 'postalCode', e.target.value)}
                className="w-24 bg-[#1c1a17] border border-[#3d352b] rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="31000"
              />
              <input
                type="text"
                value={devis.client.city}
                onChange={(e) => updateField('client', 'city', e.target.value)}
                className="flex-1 bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="Toulouse"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Email de contact</label>
            <input
              type="email"
              value={devis.client.email}
              onChange={(e) => updateField('client', 'email', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="programmation@festival.org"
            />
          </div>
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Téléphone</label>
            <input
              type="tel"
              value={devis.client.phone}
              onChange={(e) => updateField('client', 'phone', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Détails du Concert */}
      <div className="bg-[#151311] border border-[#2b251f] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-display">
          <Calendar className="w-4 h-4" />
          <span>Détails du Concert & Représentation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Nom de l'événement / Scène</label>
            <input
              type="text"
              value={devis.event.name}
              onChange={(e) => updateField('event', 'name', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="Ex: Fête de la Musique / Scène Chapiteau"
            />
          </div>
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Date prévue du concert</label>
            <input
              type="date"
              value={devis.event.date}
              onChange={(e) => updateField('event', 'date', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs text-[#a09483] mb-1">Lieu précis & Commune</label>
            <input
              type="text"
              value={devis.event.location}
              onChange={(e) => updateField('event', 'location', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="Parc des sports, Toulouse"
            />
          </div>
          <div>
            <label className="block text-xs text-[#a09483] mb-1">Créneau horaire / Durée</label>
            <input
              type="text"
              value={devis.event.timeSlot}
              onChange={(e) => updateField('event', 'timeSlot', e.target.value)}
              className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="21h00 - 23h00 (1h30)"
            />
          </div>
        </div>

        {/* Effectif / Nombre de musiciens */}
        <div className="pt-2 border-t border-[#27211a]">
          <label className="block text-xs text-[#a09483] mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Nombre de musiciens sur scène (Effectif)</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="25"
                value={devis.event.musiciansCount || 11}
                onChange={(e) => handleMusiciansCountChange(e.target.value)}
                className="w-20 bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-1.5 text-sm text-center font-bold text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-xs text-[#a09483]">musiciens</span>
            </div>

            {/* Boutons rapides pour les formules classiques */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { count: 11, label: '11 (Formule complète)' },
                { count: 8, label: '8 (Intermédiaire)' },
                { count: 6, label: '6 (Acoustique / Fanfare)' },
              ].map((preset) => {
                const isSelected = (devis.event.musiciansCount || 11) === preset.count;
                return (
                  <button
                    key={preset.count}
                    type="button"
                    onClick={() => handleMusiciansCountChange(preset.count)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      isSelected
                        ? 'bg-amber-500 text-black border-amber-500 font-semibold shadow-sm'
                        : 'bg-[#1c1a17] text-[#9f9485] border-[#2e2720] hover:text-white hover:bg-[#25211c]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-[10px] text-[#796f60] mt-1.5">
            💡 La modification du nombre de musiciens met à jour automatiquement la description de la prestation, l'effectif sur le devis, les repas dans les conditions d'accueil, et le texte des emails.
          </p>
        </div>
      </div>

      {/* Section 4: Lignes de facturation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-display">
            <Euro className="w-4 h-4" />
            <span>Prestations & Tarifs</span>
          </div>
          <button
            type="button"
            onClick={() => addItem()}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter une ligne
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs text-[#7e7465] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Presets rapides :
          </span>
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addItem({ id: Date.now().toString(), ...preset })}
              className="text-[11px] bg-[#221e1a] hover:bg-[#2e2923] text-[#cfc4b4] px-2.5 py-1 rounded-md border border-[#383027] transition"
            >
              + {preset.description.split('(')[0].trim()} ({preset.unitPrice} €)
            </button>
          ))}
        </div>

        {/* Items list */}
        <div className="space-y-2">
          {devis.items.map((item, index) => {
            const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            return (
              <div
                key={item.id || index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-[#141210] border border-[#2e2720] rounded-xl p-3"
              >
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="Description de la prestation..."
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-20">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-2 py-1.5 text-xs text-center text-white focus:outline-none focus:border-amber-500"
                      min="1"
                      title="Quantité"
                    />
                  </div>
                  <div className="w-28 relative">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full bg-[#1c1a17] border border-[#3d352b] rounded-lg px-3 py-1.5 text-xs text-right pr-6 text-white focus:outline-none focus:border-amber-500 font-mono"
                      step="50"
                      title="Prix unitaire HT"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-[#7e7465]">€</span>
                  </div>
                  <div className="w-28 text-right font-mono font-semibold text-xs text-amber-400">
                    {lineTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={devis.items.length <= 1}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Supprimer la ligne"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Discount & Totals in form */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between pt-3 border-t border-[#2d2822] gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a09483]">Remise éventuelle :</span>
            <div className="relative w-28">
              <input
                type="number"
                value={devis.discount || 0}
                onChange={(e) => updateField(null, 'discount', Number(e.target.value))}
                className="w-full bg-[#141210] border border-[#3d352b] rounded-lg px-3 py-1 text-xs text-right pr-6 text-white focus:outline-none focus:border-amber-500 font-mono"
                min="0"
              />
              <span className="absolute right-2 top-1 text-xs text-[#7e7465]">€</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#a09483] mr-2">Total Net à Payer (Exonéré TVA) :</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              {(
                devis.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0) -
                (Number(devis.discount) || 0)
              ).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}{' '}
              €
            </span>
          </div>
        </div>
      </div>

      {/* Section 5: Conditions d'accueil & Notes */}
      <div>
        <label className="block text-xs font-medium text-[#c4b9a9] mb-1">
          Conditions d'accueil, loges & repas (inclus sur le devis)
        </label>
        <textarea
          rows={2}
          value={devis.notes}
          onChange={(e) => updateField(null, 'notes', e.target.value)}
          className="w-full bg-[#141210] border border-[#3d352b] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          placeholder="Ex: Repas chaud pour 11 personnes, loge fermant à clé avec eau et rafraîchissements..."
        />
      </div>
    </div>
  );
};
