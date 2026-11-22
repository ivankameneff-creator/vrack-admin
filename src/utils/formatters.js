export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatDateFr = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const generateDevisNumber = (existingCount = 0) => {
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  const nextNum = (existingCount + 1).toString().padStart(2, '0');
  return `${yearSuffix}D${nextNum}`;
};

export const getDefaultDevis = (currentUser = null, defaultGroup = null) => {
  const today = new Date().toISOString().split('T')[0];
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  const group = defaultGroup || {
    id: 'vrack',
    name: 'VRACK',
    baseline: 'Fanfare & Musiques Balkaniques Électrisantes - 11 musiciens',
    defaultMusicians: 11
  };
  const musicians = group.defaultMusicians || 11;
  const creator = currentUser
    ? { id: currentUser.id, name: currentUser.name, role: currentUser.role }
    : { name: 'Yann', role: 'Booking & Diffusion' };

  return {
    id: `devis-${Date.now()}`,
    number: `${yearSuffix}D01`,
    date: today,
    validityDays: 30,
    paymentTerms: 'Règlement sous 30 jours par virement ou chèque',
    createdBy: creator,
    group: {
      id: group.id,
      name: group.name,
      baseline: group.baseline
    },
    
    // Organisateur / Client
    client: {
      name: 'Comité des Fêtes / Festival',
      contactPerson: 'Responsable Programmation',
      address: 'Place de la Mairie',
      postalCode: '31000',
      city: 'Toulouse',
      country: 'France',
      email: 'contact@festival-exemple.fr',
      phone: '06 00 00 00 00',
      siret: ''
    },

    // Événement
    event: {
      name: 'Festival ou Soirée Concert',
      date: today,
      location: 'Scène Principale / Plein air',
      timeSlot: 'Concert en soirée (21h00 - 23h00)',
      musiciansCount: musicians
    },

    // Lignes de devis
    items: [
      {
        id: '1',
        description: `Intervention musicale du groupe ${group.name} (${musicians} musiciens) - Concert festif 1h30 à 2h00`,
        quantity: 1,
        unitPrice: 1200
      },
      {
        id: '2',
        description: 'Frais de déplacement et défraiement kilométrique (Toulouse A/R)',
        quantity: 1,
        unitPrice: 150
      }
    ],

    // Remise éventuelle
    discount: 0,
    
    // Notes & Conditions d'accueil
    notes: `Le repas chaud pour ${musicians} musiciens et l'hébergement/loges si nécessaire sont à la charge de l'organisateur. Fiche technique fournie en annexe.`,
    
    status: 'Brouillon' // Brouillon, Envoyé, Accepté, Refusé
  };
};
