import React, { useState, useEffect } from 'react';
import { EMAIL_TEMPLATES } from '../../constants/emailTemplates';
import { ASSO_INFO } from '../../constants/assoInfo';
import { formatDateFr, formatCurrency } from '../../utils/formatters';
import { Copy, Check, Mail, ExternalLink, Image, Paperclip, Sparkles, Send } from 'lucide-react';

export const MailGenerator = ({ devis, onGoToPhotos }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState('festival');
  const [includeDevisMention, setIncludeDevisMention] = useState(true);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [copied, setCopied] = useState(false);

  // Calculate devis amounts
  const totalNet = devis.items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  ) - (Number(devis.discount) || 0);

  const templateData = {
    eventName: devis.event.name,
    clientName: devis.client.name,
    clientCity: devis.client.city,
    contactName: devis.client.contactPerson,
    date: devis.event.date,
    dateFormatted: formatDateFr(devis.event.date),
    devisNumber: devis.number,
    totalTTC: formatCurrency(Math.max(0, totalNet)),
    includeDevisMention: includeDevisMention,
    groupName: devis.group?.name || ASSO_INFO.groupName,
    creatorName: devis.createdBy?.name || 'Yann',
    musiciansCount: devis.event?.musiciansCount || 11
  };

  const currentTemplate = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId) || EMAIL_TEMPLATES[0];

  // Update generated content when template or devis data changes
  useEffect(() => {
    setCustomSubject(currentTemplate.subject(templateData));
    setCustomBody(currentTemplate.generateBody(templateData));
  }, [selectedTemplateId, devis, includeDevisMention]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(customBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
    }
  };

  const handleOpenMailto = () => {
    const to = devis.client.email || '';
    const subject = encodeURIComponent(customSubject);
    const body = encodeURIComponent(customBody);
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              Générateur d'Email de Proposition de Concert
            </h2>
            <p className="text-xs text-[#a09483] mt-1">
              Synchronisé automatiquement avec votre devis n° <span className="font-mono text-amber-400 font-semibold">{devis.number}</span> pour <strong className="text-white">{devis.client.name || 'le client'}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Texte copié !' : 'Copier l\'email'}
            </button>

            <button
              onClick={handleOpenMailto}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#2a2520] hover:bg-[#38312b] text-[#f0e8db] border border-[#3d352b] rounded-lg transition"
              title="Ouvrir dans Outlook, Thunderbird, Apple Mail..."
            >
              <Send className="w-4 h-4 text-amber-400" />
              Ouvrir dans Mail
            </button>
          </div>
        </div>

        {/* Template Selector Pills */}
        <div className="mt-5 pt-4 border-t border-[#2d2822]">
          <p className="text-xs font-medium text-[#c4b9a9] mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Sélectionnez le type d'organisateur / occasion :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {EMAIL_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-white font-medium shadow-sm'
                      : 'bg-[#151311] border-[#2e2720] text-[#9f9485] hover:text-[#dcd2c4] hover:bg-[#1f1b17]'
                  }`}
                >
                  <span className="font-semibold text-xs leading-snug">{tmpl.label}</span>
                  <span className="text-[10px] text-[#796f60] mt-1 line-clamp-1">{tmpl.target}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Editor on Left, Attachments & Tips on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject & Body Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Email Recipient & Subject */}
          <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 shadow-lg space-y-3">
            <div>
              <label className="block text-xs text-[#a09483] mb-1">
                Destinataire (Email de l'organisateur)
              </label>
              <input
                type="email"
                value={devis.client.email}
                readOnly
                className="w-full bg-[#141210] border border-[#302820] rounded-lg px-3 py-2 text-xs text-[#dcd2c4] font-mono cursor-not-allowed"
                placeholder="Renseigné depuis l'onglet Devis (ex: contact@festival.org)"
              />
            </div>

            <div>
              <label className="block text-xs text-[#a09483] mb-1">
                Objet du message
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full bg-[#141210] border border-[#3d352b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#f0e8db]">
                Corps du message (modifiable)
              </label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#a09483] flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDevisMention}
                    onChange={(e) => setIncludeDevisMention(e.target.checked)}
                    className="rounded bg-[#141210] border-[#3d352b] text-amber-500 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Inclure mention devis & tarif</span>
                </label>
              </div>
            </div>

            <textarea
              rows={16}
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              className="w-full bg-[#141210] border border-[#3d352b] rounded-xl p-4 text-xs text-[#f0e8db] font-sans leading-relaxed focus:outline-none focus:border-amber-500 whitespace-pre-wrap selection:bg-amber-500 selection:text-black"
            />

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-[#796f60]">
                💡 Astuce : Vous pouvez personnaliser le texte ci-dessus avant de cliquer sur "Copier l'email".
              </p>
              <button
                onClick={handleCopyText}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4"
              >
                {copied ? '✓ Texte copié dans le presse-papier' : 'Copier tout le texte'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Suggested Attachments & Media Quick Access */}
        <div className="space-y-4">
          {/* Pièces jointes recommandées */}
          <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-display">
              <Paperclip className="w-4 h-4" />
              <span>Pièces jointes recommandées</span>
            </div>
            <p className="text-xs text-[#a09483]">
              À joindre dans votre logiciel email avant l'envoi :
            </p>

            <div className="space-y-2 pt-1">
              <div className="bg-[#141210] border border-[#2e2720] rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Devis n° {devis.number}.pdf</p>
                  <p className="text-[10px] text-[#796f60]">Montant : {formatCurrency(Math.max(0, totalNet))}</p>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
                  À télécharger
                </span>
              </div>

              <div className="bg-[#141210] border border-[#2e2720] rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Fiche Technique Son 2026.pdf</p>
                  <p className="text-[10px] text-[#796f60]">Plan de scène & patch régie (11 musiciens)</p>
                </div>
                <a
                  href="/docs/VRACK_FICHE_TECH_SON_2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] bg-[#221e1a] hover:bg-[#2e2923] text-amber-400 border border-[#3a3227] px-2 py-1 rounded transition"
                >
                  Télécharger
                </a>
              </div>

              <div className="bg-[#141210] border border-[#2e2720] rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Dossier Presse / EPK.pdf</p>
                  <p className="text-[10px] text-[#796f60]">Présentation du groupe & revue de presse</p>
                </div>
                <a
                  href="/docs/One_pager_VRACK.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] bg-[#221e1a] hover:bg-[#2e2923] text-amber-400 border border-[#3a3227] px-2 py-1 rounded transition"
                >
                  Télécharger
                </a>
              </div>
            </div>
          </div>

          {/* Photos du groupe à joindre */}
          <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-display">
                <Image className="w-4 h-4" />
                <span>Photos du Groupe</span>
              </div>
              <button
                onClick={onGoToPhotos}
                className="text-xs text-amber-400 hover:underline"
              >
                Voir tout →
              </button>
            </div>
            <p className="text-xs text-[#a09483]">
              Photos officielles de haute qualité pour illustrer la proposition :
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="relative group rounded-lg overflow-hidden border border-[#3d352b] aspect-video bg-black">
                <img
                  src="/images/photo_groupe.png"
                  alt="Vrack Groupe"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <a
                  href="/images/photo_groupe.png"
                  download="VRACK_Photo_Groupe_Officielle.png"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-semibold text-white transition"
                >
                  Télécharger HD
                </a>
              </div>

              <div className="relative group rounded-lg overflow-hidden border border-[#3d352b] aspect-video bg-black">
                <img
                  src="/images/photo_live.png"
                  alt="Vrack Live"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <a
                  href="/images/photo_live.png"
                  download="VRACK_Photo_Live_Scene.png"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-semibold text-white transition"
                >
                  Télécharger HD
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
