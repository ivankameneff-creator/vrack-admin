export const EMAIL_TEMPLATES = [
  {
    id: 'festival',
    label: 'Festival / Plein air / Fête populaire',
    target: 'Programmateurs de festivals et fêtes de rue',
    subject: (d) => `Proposition de concert - ${d.groupName || 'VRACK'} (${d.eventName || 'Votre Festival'})`,
    generateBody: (d) => `Bonjour${d.contactName ? ' ' + d.contactName : ''},

Je me permets de vous contacter au nom du groupe toulousain ${d.groupName || 'VRACK'} dans le cadre de la programmation de ${d.eventName || 'votre festival / événement'}${d.date ? ' pour la date du ' + d.dateFormatted : ''}.

${d.groupName || 'VRACK'}, c'est une formation festive et cuivrée de ${d.musiciansCount || 11} musiciens réunissant une déferlante d'énergie musicale et dansante. Notre spectacle généreux et communicatif transforme chaque représentation en une grande fête populaire, idéale pour faire vibrer votre public en extérieur ou sous chapiteau.

🎶 Découvrir ${d.groupName || 'VRACK'} en musique :
• Site officiel : https://www.vrack.fr
• Écouter sur Spotify : https://open.spotify.com/artist/vrack
• Fiche technique & dossier de presse : consultable en pièce jointe

${d.includeDevisMention ? `Pour faciliter l'étude de notre candidature, vous trouverez ci-joint notre devis prévisionnel n° ${d.devisNumber || 'VRACK'} d'un montant de ${d.totalTTC} TTC (association La Sauce en Vrac exonérée de TVA, facilités de règlement).\n\n` : ''}Nous sommes entièrement autonomes ou pouvons nous adapter avec grand plaisir à votre équipe technique (notre fiche technique détaillée est jointe).

N'hésitez pas à nous faire part de vos disponibilités pour échanger de vive voix !

Très cordialement,

${d.creatorName || 'Yann'} & le groupe ${d.groupName || 'VRACK'}
Association « La Sauce en Vrac »
Tél : 06 61 81 27 86
Email : groupe.vrack@gmail.com
Web : www.vrack.fr`
  },
  {
    id: 'mairie',
    label: 'Mairie / Service Culturel / Fête de la Musique',
    target: 'Responsables culturels municipaux, comités des fêtes',
    subject: (d) => `Concert ${d.groupName || 'VRACK'} - Saison culturelle & animations (${d.clientCity || d.clientName || 'Votre commune'})`,
    generateBody: (d) => `Madame, Monsieur${d.contactName ? ' ' + d.contactName : ''},

Dans le cadre de la programmation culturelle et festive de ${d.clientCity || d.clientName || 'votre commune'}, nous souhaitons vous proposer l'intervention musicale du groupe ${d.groupName || 'VRACK'}.

Basé à Toulouse et structuré sous forme d'association loi 1901 (La Sauce en Vrac), ${d.groupName || 'VRACK'} réunit ${d.musiciansCount || 11} musiciens professionnels et passionnés autour d'un répertoire festif et métissé. Notre spectacle tout public s'adapte parfaitement aux manifestations de plein air, fêtes locales, festivals municipaux ou soirées d'ouverture de saison.

✨ Atouts pour votre manifestation :
- Un spectacle vivant, intergénérationnel et ultra festif (1h30 à 2h de live).
- ${d.musiciansCount || 11} musiciens sur scène (cuivres, percussions, chant, instruments traditionnels).
- Structure administrative simplifiée : facture ou contrat de cession associatif (exonéré de TVA art. 293 B du CGI, déclaration et règlement facilités).

${d.includeDevisMention ? `Vous trouverez en pièce jointe notre proposition tarifaire détaillée n° ${d.devisNumber || ''} s'élevant à ${d.totalTTC}.\n\n` : ''}Vous pouvez écouter nos morceaux et visualiser des extraits de nos prestations sur notre site : www.vrack.fr.

Restant à votre entière disposition pour tout renseignement complémentaire ou devis adapté à votre cahier des charges,

Bien cordialement,

${d.creatorName || 'Yann'} - Diffusion & Booking ${d.groupName || 'VRACK'}
Association « La Sauce en Vrac »
Tél : 06 61 81 27 86
Email : groupe.vrack@gmail.com`
  },
  {
    id: 'salle',
    label: 'Salle de concert / SMAC / Tiers-lieu',
    target: 'Programmateurs de salles et scènes de musiques actuelles',
    subject: (d) => `Candidature concert - ${d.groupName || 'VRACK'} (${d.eventName || 'Saison'})`,
    generateBody: (d) => `Bonjour${d.contactName ? ' ' + d.contactName : ''},

Je vous sollicite aujourd'hui pour proposer le concert du groupe ${d.groupName || 'VRACK'} au sein de votre programmation${d.eventName ? ' pour ' + d.eventName : ''}.

${d.groupName || 'VRACK'} propose un concert scénique intense de ${d.musiciansCount || 11} musiciens mêlant sonorités d'Europe de l'Est, musiques du monde et énergie festive. Nos arrangements originaux et notre son puissant créent une véritable communion avec la salle.

📁 Éléments de présentation :
- Site et clips : https://www.vrack.fr
- Écoute streaming : https://open.spotify.com/artist/vrack
- Fiche technique et plan de scène : en pièce jointe

${d.includeDevisMention ? `Nous vous joignons notre devis prévisionnel n° ${d.devisNumber || ''} (${d.totalTTC}) comprenant notre plateau complet.\n\n` : ''}Notre régisseur technique Didier (06 72 38 72 82) se tient également à la disposition de votre équipe pour anticiper les besoins d'accueil.

Au plaisir d'échanger avec vous sur une future collaboration !

Musicalement,

${d.creatorName || 'Yann'} pour ${d.groupName || 'VRACK'}
06 61 81 27 86 | groupe.vrack@gmail.com`
  },
  {
    id: 'bar',
    label: 'Bar / Café-concert / Guinguette',
    target: 'Gérants de bars, brasseries, guinguettes d\'été',
    subject: (d) => `Concert festif avec ${d.groupName || 'VRACK'} (${d.musiciansCount || 11} musiciens) pour ${d.clientName || 'votre établissement'}`,
    generateBody: (d) => `Salut${d.contactName ? ' ' + d.contactName : ''},

Je viens vers vous pour voir s'il serait possible de caler une soirée concert avec le groupe toulousain ${d.groupName || 'VRACK'} chez vous${d.date ? ' aux alentours du ' + d.dateFormatted : ''} !

${d.groupName || 'VRACK'}, c'est un collectif de ${d.musiciansCount || 11} musiciens (cuivres, percussions, accordéon, chant...) qui balance une musique survitaminée et ultra festive. C'est le genre de concert où l'ambiance décolle en 5 minutes et où tout le monde trinque et danse.

🎧 Pour jeter une oreille :
- Site web : https://www.vrack.fr
- Spotify / streaming : https://open.spotify.com/artist/vrack

${d.includeDevisMention ? `Je t'ai préparé une estimation chiffrée n° ${d.devisNumber || ''} (${d.totalTTC}) pour notre passage.\n\n` : ''}On s'adapte facilement à l'espace et on peut être autonomes selon vos possibilités sonores.

Dis-moi si vous avez des dates ouvertes prochainement pour qu'on bloque ça ensemble !

À très vite,

${d.creatorName || 'Yann'} - ${d.groupName || 'VRACK'}
06 61 81 27 86 / groupe.vrack@gmail.com`
  },
  {
    id: 'relance',
    label: 'Relance / Suivi de proposition',
    target: 'Suivi après un premier échange ou envoi de devis',
    subject: (d) => `Suivi proposition de concert - ${d.groupName || 'VRACK'} (${d.eventName || d.clientName || ''})`,
    generateBody: (d) => `Bonjour${d.contactName ? ' ' + d.contactName : ''},

Je me permets de revenir vers vous concernant notre proposition de concert pour ${d.eventName || 'votre événement'}${d.date ? ' envisagée le ' + d.dateFormatted : ''}.

Avez-vous pu étudier notre dossier et le devis n° ${d.devisNumber || ''} de ${d.totalTTC} que nous vous avions transmis ?

Nous finalisons actuellement notre planning de tournée pour les mois à venir et serions ravis de pouvoir compter cette date parmi nos représentations.

Si vous avez des questions sur la logistique, l'accueil technique ou le format du concert, je suis à votre entière écoute par retour de mail ou par téléphone.

En espérant vous retrouver très bientôt sur scène !

Chaleureusement,

${d.creatorName || 'Yann'} - ${d.groupName || 'VRACK'}
06 61 81 27 86 | groupe.vrack@gmail.com
www.vrack.fr`
  }
];
