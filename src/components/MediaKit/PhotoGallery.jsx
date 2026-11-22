import React, { useState } from 'react';
import { ASSO_INFO } from '../../constants/assoInfo';
import { Download, Copy, Check, ExternalLink, Image as ImageIcon, FileText, Music, Info } from 'lucide-react';

export const PhotoGallery = () => {
  const [copiedKey, setCopiedKey] = useState(null);

  const photos = [
    {
      id: 'photo-groupe',
      title: 'Photo de Groupe Officielle',
      subtitle: 'Les 11 musiciens au complet sur scène',
      src: '/images/photo_groupe.png',
      filename: 'VRACK_Photo_Groupe_HD.png',
      tags: ['HD', 'Presse', 'Scène']
    },
    {
      id: 'photo-live',
      title: 'Concert Live en Plein Air',
      subtitle: 'Ambiance festive et festive cuivrée',
      src: '/images/photo_live.png',
      filename: 'VRACK_Concert_Live.png',
      tags: ['Live', 'Plein air', 'Ambiance']
    },
    {
      id: 'photo-scene',
      title: 'Visuel Scène & Album',
      subtitle: 'Visuel artistique "Au complet"',
      src: '/images/photo_scene.png',
      filename: 'VRACK_Visuel_Artiste.png',
      tags: ['Visuel', 'Affiche']
    }
  ];

  const documents = [
    {
      id: 'compagnie-catalogue',
      title: 'Catalogue des Groupes - La Compagnie en Vrack',
      description: 'Présentation des 7 projets artistiques : VRACK, ANYATRA, TOMAKÉ, DOSMOZ, DMB\'S, YOYU, 34S.',
      url: '/docs/La_compagnie_en_Vrack_PRESENTATION.pdf',
      filename: 'La_compagnie_en_Vrack_PRESENTATION.pdf',
      format: 'PDF',
      updated: 'Officiel'
    },
    {
      id: 'fiche-tech',
      title: 'Fiche Technique Son & Patch VRACK 2026',
      description: 'Plan de scène, implantation des 11 musiciens, besoins retours et micros.',
      url: '/docs/VRACK_FICHE_TECH_SON_2026.pdf',
      filename: 'VRACK_FICHE_TECH_SON_2026.pdf',
      format: 'PDF',
      updated: '2026'
    },
    {
      id: 'one-pager',
      title: 'One Pager / Dossier de Presse (EPK) VRACK',
      description: 'Présentation synthétique du groupe, revue de presse, bio et discographie.',
      url: '/docs/One_pager_VRACK.pdf',
      filename: 'One_pager_VRACK.pdf',
      format: 'PDF',
      updated: '2026'
    }
  ];

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              Photos Officielles & Kit Média VRACK
            </h2>
            <p className="text-xs text-[#a09483] mt-1">
              Ressources visuelles et documents techniques prêts à télécharger et partager avec les programmateurs.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Photos Officielles */}
      <div>
        <h3 className="text-base font-bold font-display text-white mb-3 flex items-center gap-2">
          <span>📸 Photos Presse & Promotion</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-sans font-medium">
            Libres de droits pour communication concerts
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-[#1c1a17] border border-[#332c24] rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {photo.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-black/70 backdrop-blur px-2 py-0.5 rounded text-amber-300 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{photo.title}</h4>
                  <p className="text-xs text-[#8d8272] mt-0.5">{photo.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2d2822] flex items-center justify-between gap-2">
                  <a
                    href={photo.src}
                    download={photo.filename}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </a>
                  <button
                    onClick={() => handleCopy(photo.id, window.location.origin + photo.src)}
                    className="p-2 bg-[#25211c] hover:bg-[#322c25] text-[#dcd2c4] rounded-lg transition"
                    title="Copier le lien direct"
                  >
                    {copiedKey === photo.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Fiches Techniques & Presse */}
      <div>
        <h3 className="text-base font-bold font-display text-white mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Documents Officiels (Fiche Technique & Dossier Presse)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{doc.title}</h4>
                    <span className="text-[10px] bg-[#29241e] text-zinc-300 px-1.5 py-0.2 rounded font-mono">
                      {doc.format}
                    </span>
                  </div>
                  <p className="text-xs text-[#8d8272] mt-0.5">{doc.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-xs text-[#dcd2c4] hover:text-white bg-[#26211c] hover:bg-[#332d26] rounded-lg transition"
                  title="Consulter en ligne"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={doc.url}
                  download={doc.filename}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Liens Utiles & Bio Prête à Copier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Liens streaming & web */}
        <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 shadow-lg space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-500" />
            <span>Liens Officiels & Streaming</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-[#141210] border border-[#2b251f] p-2.5 rounded-xl">
              <div>
                <p className="font-semibold text-white">Site Officiel</p>
                <p className="text-[11px] text-[#8d8272]">{ASSO_INFO.website}</p>
              </div>
              <button
                onClick={() => handleCopy('link-web', ASSO_INFO.website)}
                className="p-1.5 text-xs text-amber-400 hover:text-amber-300 transition"
              >
                {copiedKey === 'link-web' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#141210] border border-[#2b251f] p-2.5 rounded-xl">
              <div>
                <p className="font-semibold text-white">Profil Spotify</p>
                <p className="text-[11px] text-[#8d8272]">{ASSO_INFO.socials.spotify}</p>
              </div>
              <button
                onClick={() => handleCopy('link-spotify', ASSO_INFO.socials.spotify)}
                className="p-1.5 text-xs text-amber-400 hover:text-amber-300 transition"
              >
                {copiedKey === 'link-spotify' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#141210] border border-[#2b251f] p-2.5 rounded-xl">
              <div>
                <p className="font-semibold text-white">Chaine YouTube</p>
                <p className="text-[11px] text-[#8d8272]">{ASSO_INFO.socials.youtube}</p>
              </div>
              <button
                onClick={() => handleCopy('link-yt', ASSO_INFO.socials.youtube)}
                className="p-1.5 text-xs text-amber-400 hover:text-amber-300 transition"
              >
                {copiedKey === 'link-yt' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bio Courte presse */}
        <div className="bg-[#1c1a17] border border-[#332c24] rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500" />
              <span>Bio Officielle Presse (3 lignes)</span>
            </h4>
            <button
              onClick={() => handleCopy('bio-short', ASSO_INFO.bioShort)}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              {copiedKey === 'bio-short' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier la bio</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#141210] border border-[#2b251f] p-3 rounded-xl text-xs text-[#dcd2c4] leading-relaxed">
            "{ASSO_INFO.bioShort}"
          </div>

          <div className="text-[11px] text-[#8d8272] pt-1">
            <strong>Instrumentation : </strong> {ASSO_INFO.instruments}
          </div>
        </div>
      </div>
    </div>
  );
};
