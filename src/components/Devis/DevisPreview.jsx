import React from 'react';
import { ASSO_INFO } from '../../constants/assoInfo';
import { formatCurrency, formatDateFr, formatDateShort } from '../../utils/formatters';

export const DevisPreview = ({ devis, id = "devis-printable-area" }) => {
  const totalRawHT = devis.items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discount = Number(devis.discount) || 0;
  const totalNetHT = Math.max(0, totalRawHT - discount);
  const totalTTC = totalNetHT; // Franchise en base de TVA pour asso loi 1901

  return (
    <div className="flex justify-center w-full">
      <div
        id={id}
        className="a4-sheet bg-white text-zinc-900 p-8 sm:p-10 rounded-xl shadow-2xl relative flex flex-col justify-between font-sans text-xs leading-relaxed"
      >
        {/* TOP SECTION: Header */}
        <div>
          <div className="flex justify-between items-start border-b-2 border-amber-600 pb-5">
            {/* Association & Group Details */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-zinc-950 text-amber-500 font-extrabold flex items-center justify-center text-2xl font-display shadow">
                  {(devis.group?.name || 'V')[0]}
                </div>
                <div>
                  <h1 className="text-xl font-extrabold font-display tracking-tight text-zinc-950">
                    {devis.group?.name || 'VRACK'}
                  </h1>
                  <p className="text-[10px] font-semibold text-amber-700 tracking-wide uppercase">
                    {devis.group?.baseline || ASSO_INFO.baseline}
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-zinc-600 space-y-0.5">
                <p className="font-bold text-zinc-900">{ASSO_INFO.name}</p>
                <p>{ASSO_INFO.address}</p>
                <p>{ASSO_INFO.postalCode} {ASSO_INFO.city} — France</p>
                <p>Tél : <span className="font-medium text-zinc-800">{ASSO_INFO.phone}</span></p>
                <p>Email : <span className="font-medium text-zinc-800">{ASSO_INFO.email}</span></p>
                <p>Site web : <span className="font-medium text-amber-800">{ASSO_INFO.websiteDisplay}</span></p>
              </div>
            </div>

            {/* Devis Metadata & Creator */}
            <div className="text-right">
              <span className="inline-block bg-amber-600 text-white font-extrabold text-sm font-display px-3 py-1 rounded tracking-wider uppercase mb-2">
                DEVIS
              </span>
              <table className="text-[11px] text-right ml-auto border-separate border-spacing-y-0.5">
                <tbody>
                  <tr>
                    <td className="text-zinc-500 pr-3 font-medium">Devis N° :</td>
                    <td className="font-mono font-bold text-zinc-950">{devis.number}</td>
                  </tr>
                  <tr>
                    <td className="text-zinc-500 pr-3 font-medium">Date d'émission :</td>
                    <td className="font-semibold text-zinc-800">{formatDateShort(devis.date)}</td>
                  </tr>
                  <tr>
                    <td className="text-zinc-500 pr-3 font-medium">Validité :</td>
                    <td className="text-zinc-700">{devis.validityDays || 30} jours</td>
                  </tr>
                  {devis.createdBy?.name && (
                    <tr>
                      <td className="text-zinc-500 pr-3 font-medium">Établi par :</td>
                      <td className="font-semibold text-amber-800">{devis.createdBy.name}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CLIENT & OBJECT SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-5">
            {/* Objet du concert */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-3.5">
              <p className="text-[10px] uppercase font-bold text-amber-900 tracking-wider mb-1">
                Objet de la prestation
              </p>
              <p className="text-xs font-bold text-zinc-950">
                {devis.event.name || 'Concert du groupe VRACK'}
              </p>
              <div className="text-[11px] text-zinc-700 mt-1 space-y-0.5">
                {devis.event.date && (
                  <p>
                    <span className="text-zinc-500 font-medium">Date prévue :</span>{' '}
                    <span className="font-semibold text-zinc-900">{formatDateFr(devis.event.date)}</span>
                  </p>
                )}
                {devis.event.location && (
                  <p>
                    <span className="text-zinc-500 font-medium">Lieu :</span> {devis.event.location}
                  </p>
                )}
                {devis.event.timeSlot && (
                  <p>
                    <span className="text-zinc-500 font-medium">Créneau / Format :</span> {devis.event.timeSlot}
                  </p>
                )}
                <p>
                  <span className="text-zinc-500 font-medium">Effectif :</span>{' '}
                  {devis.event.musiciansCount
                    ? `${devis.event.musiciansCount} musiciens sur scène`
                    : 'Plateau de 11 musiciens'}
                </p>
              </div>
            </div>

            {/* Encadré Destinataire / Organisateur */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                Destinataire / Client
              </p>
              <p className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                {devis.client.name || 'Nom de la structure / Organisateur'}
              </p>
              {devis.client.contactPerson && (
                <p className="text-[11px] font-medium text-zinc-800">
                  À l'attention de : {devis.client.contactPerson}
                </p>
              )}
              <div className="text-[11px] text-zinc-600 mt-1 space-y-0.5">
                {devis.client.address && <p>{devis.client.address}</p>}
                {(devis.client.postalCode || devis.client.city) && (
                  <p>{devis.client.postalCode} {devis.client.city}</p>
                )}
                {devis.client.email && <p>Email : {devis.client.email}</p>}
                {devis.client.phone && <p>Tél : {devis.client.phone}</p>}
              </div>
            </div>
          </div>

          {/* TABLE OF ITEMS */}
          <div className="my-5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white text-[10px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3 rounded-l">Désignation & Description</th>
                  <th className="py-2.5 px-3 text-center w-16">Qté</th>
                  <th className="py-2.5 px-3 text-right w-28">Prix Unit. HT</th>
                  <th className="py-2.5 px-3 text-right w-28 rounded-r">Montant HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {devis.items.map((item, index) => {
                  const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}>
                      <td className="py-2.5 px-3 text-zinc-900 font-medium">
                        {item.description || 'Prestation'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-zinc-700">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-700">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-zinc-900">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TOTALS & SUMMARY SECTION */}
          <div className="flex justify-end my-4">
            <div className="w-72 bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-right space-y-1">
              <div className="flex justify-between text-zinc-600 text-[11px]">
                <span>Total Brut HT :</span>
                <span className="font-mono font-medium">{formatCurrency(totalRawHT)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-amber-700 text-[11px] font-medium">
                  <span>Remise accordée :</span>
                  <span className="font-mono">- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-700 text-[11px] font-semibold">
                <span>Total Net HT :</span>
                <span className="font-mono">{formatCurrency(totalNetHT)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[10px]">
                <span>TVA (0%) :</span>
                <span className="font-mono">0,00 €</span>
              </div>
              <p className="text-[9px] text-zinc-500 italic pt-0.5 border-t border-zinc-200 text-left">
                {ASSO_INFO.tvaMention}
              </p>
              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t-2 border-amber-600">
                <span>NET À PAYER :</span>
                <span className="font-mono text-amber-700 text-base">{formatCurrency(totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* CONDITIONS D'ACCUEIL & NOTES */}
          {devis.notes && (
            <div className="my-3 p-2.5 bg-zinc-50 rounded border border-zinc-200 text-[10px] text-zinc-600">
              <span className="font-bold text-zinc-800">Conditions d'accueil & logistique : </span>
              {devis.notes}
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Banking, Terms, Signature */}
        <div className="mt-4 pt-3 border-t-2 border-zinc-200">
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Mode de règlement & RIB */}
            <div className="space-y-1.5 text-[10px] text-zinc-600">
              <p className="font-bold text-zinc-900 uppercase tracking-wide">
                Modalités de règlement & Coordonnées bancaires
              </p>
              <p>
                <span className="font-medium text-zinc-700">Conditions :</span> {devis.paymentTerms}
              </p>
              <p>
                <span className="font-medium text-zinc-700">Règlement par chèque :</span> à libeller à l'ordre de <span className="font-semibold text-zinc-800">« Association La Sauce en Vrac »</span>
              </p>
              <div className="bg-amber-50/70 p-2 rounded border border-amber-200 text-[10px] space-y-0.5 font-mono">
                <p className="font-sans font-bold text-amber-950">Virement bancaire ({ASSO_INFO.bank.name}) :</p>
                <p><span className="text-zinc-600 font-sans">IBAN :</span> <strong className="text-zinc-900">{ASSO_INFO.bank.iban}</strong></p>
                <p><span className="text-zinc-600 font-sans">BIC :</span> <strong className="text-zinc-900">{ASSO_INFO.bank.bic}</strong></p>
              </div>
            </div>

            {/* Right: Signature Box */}
            <div className="border border-dashed border-zinc-300 rounded-lg p-2.5 flex flex-col justify-between text-[10px] bg-zinc-50/50">
              <div>
                <p className="font-bold text-zinc-800 uppercase text-center">Bon pour accord et acceptation</p>
                <p className="text-[9px] text-zinc-500 text-center italic mt-0.5">
                  (Faire précéder de la date et de la mention manuscrite « Bon pour accord »)
                </p>
              </div>
              <div className="pt-8 flex justify-between items-end text-zinc-400 text-[9px]">
                <span>Date : ___ / ___ / 2026</span>
                <span>Signature & Cachet</span>
              </div>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="mt-3 pt-2 border-t border-zinc-200 text-center text-[9px] text-zinc-500 space-x-2">
            <span>{ASSO_INFO.name}</span>
            <span>•</span>
            <span>SIRET : {ASSO_INFO.siret}</span>
            <span>•</span>
            <span>Code APE : {ASSO_INFO.ape}</span>
            <span>•</span>
            <span>RNA : {ASSO_INFO.rna}</span>
            <span>•</span>
            <span>Exonéré de TVA art. 293 B du CGI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
