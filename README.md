# VRACK Admin - Site de Gestion Administrative & Booking

Application web dédiée à la gestion administrative, la programmation de concerts et le démarchage pour le groupe musical **VRACK** (Association « **La Sauce en Vrac** », Toulouse).

---

## 🚀 Fonctionnalités Clés

### 1. 🗄️ Base de Données Cloud PostgreSQL (Supabase)
- **Synchronisation en temps réel** : Tous les devis, les groupes et les utilisateurs sont stockés dans une base **PostgreSQL** dans le cloud (Supabase) et synchronisés en direct entre tous les musiciens.
- **Tables relationnelles** :
  - `users` : Comptes et rôles des membres de l'association.
  - `groups` : Catalogue des projets artistiques avec fiches complètes, effectifs, contacts et instrumentations.
  - `devis` : Devis complets avec client, prestations, chiffrage, créateur et statut.
- **Résilience hors-ligne (Mode Hybride)** : En cas de coupure réseau ou avant configuration des clés, l'application continue de fonctionner en local.
- **Script SQL d'initialisation** : Fichier `supabase/schema.sql` prêt à être exécuté dans l'éditeur SQL de Supabase pour créer les tables et insérer les 7 groupes initiaux.

### 2. 🔐 Authentification & Attribution par Membre
- **Accès sécurisé par mot de passe** : Écran de connexion protégeant l'accès au portail (mot de passe association par défaut : `vrack`).
- **Gestion des comptes & profils** : Profils intégrés pour les membres du bureau (Yann, Antoine, Ethan, Ivan, Didier) ou création de nouveaux membres.
- **Attribution du créateur** : Tout devis créé enregistre l'identité de son créateur, visible sur le devis officiel, dans l'historique et en signature des emails.

### 2. 🎸 Support Multi-Groupes (VRACK, ANYATRA, DUMBIES...)
- **Choix du projet musical en 1-clic** :
  - **VRACK** (11 musiciens - Fanfare & musiques balkaniques métissées)
  - **ANYATRA** (5 musiciens - Musiques du monde, chansons & métissages)
  - **DUMBIES** (6 musiciens - Rock festif & cuivres)
  - **Autre Projet** (nom et configuration personnalisables)
- **Synchronisation globale** : L'en-tête du devis, la désignation des prestations, l'effectif, l'aperçu A4 officiel et les emails de proposition s'adaptent instantanément au groupe choisi tout en conservant la structure juridique productrice « Association La Sauce en Vrac ».

### 3. 📝 Créateur de Devis Officiels (Format A4)
- **Formulaire interactif** : Coordonnées organisateur, date et lieu du concert, créneau horaire, prestations chiffrées.
- **Calculs automatiques** : Totaux HT/TTC, gestion des remises, exonération de TVA (art. 293 B du CGI pour association loi 1901).
- **Aperçu haute fidélité** : Rendu en direct identique aux devis officiels de l'association avec logo, mentions légales, coordonnées bancaires (RIB/IBAN CCCM Toulouse St Agne) et zone « Bon pour accord ».
- **Export & Impression** : Bouton d'impression vectorielle directe et téléchargement du PDF prêt à être envoyé.

### 2. ✉️ Générateur de Mails de Proposition & Démarchage
- **Synchronisation automatique** : Intègre en direct les données du devis en cours (nom de l'événement, ville, date, numéro de devis et tarif).
- **5 modèles adaptés par cible** :
  - *Festival / Plein air / Fête populaire*
  - *Mairie / Service Culturel / Fête de la musique*
  - *Salle de concert / SMAC / Café-musique*
  - *Bar / Café-concert / Guinguette*
  - *Relance / Suivi de proposition*
- **Actions rapides 1-clic** :
  - `Copier l'email` (copie instantanée dans le presse-papier)
  - `Ouvrir dans Mail` (ouvre directement Thunderbird, Outlook, Apple Mail avec objet et corps pré-remplis)
  - Liste de contrôle des pièces jointes recommandées (Devis, Fiche Technique son 2026, Dossier presse EPK, Photos).

### 3. 📸 Galerie Photos & Kit Promo
- **Photos officielles du groupe** : Photo de groupe sur scène (11 musiciens), concerts live plein air, visuels d'albums en haute définition téléchargeables.
- **Documents officiels à télécharger** : Fiche technique son 2026 complète (patch + plan de scène) et dossier de presse / One Pager EPK.
- **Liens utiles & Bio presse** : Liens directs Spotify, YouTube, site officiel vrack.fr et bio courte officielle de 3 lignes prête à copier.

### 4. 📁 Historique & Sauvegarde Locale
- Mémorisation automatique de tous les devis créés dans le navigateur (`localStorage`).
- Recherche et filtrage par client, ville ou statut (*Brouillon*, *Envoyé*, *Accepté*, *Refusé*).
- Fonctions de rechargement, duplication d'un devis et export/import de sauvegarde JSON pour échanger les dossiers entre membres du bureau.

---

## 🛠️ Démarrage Local

Pour lancer le site sur votre ordinateur :

```bash
cd vrack-admin
npm install
npm run dev
```

L'application s'ouvrira automatiquement à l'adresse : `http://localhost:3000`

Pour tester les calculs et templates :
```bash
npm test
```

---

## 🌐 Déploiement en Ligne (Partage avec tout le groupe)

L'application est 100% autonome et peut être mise en ligne gratuitement en quelques minutes :

### Option A : Déploiement gratuit sur Vercel (Recommandé)
1. Installez le CLI Vercel ou connectez votre dépôt GitHub à [vercel.com](https://vercel.com).
2. Choisissez le sous-dossier `vrack-admin`.
3. Cliquez sur **Deploy**. Vous aurez une URL publique sécurisée (ex: `vrack-admin.vercel.app`) accessible depuis smartphone, tablette et ordinateur par tous les musiciens du groupe.

### Option B : Déploiement sur Netlify
1. Glissez-déposez simplement le dossier `vrack-admin/dist` généré par `npm run build` sur [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 📄 Informations Légales Intégrées

- **Association** : « La Sauce en Vrac »
- **Siège** : 3 rue de la Clarianelle, 31100 Toulouse
- **SIRET** : 442 275 632 00010 | **APE** : 9001Z | **RNA** : W313010377
- **IBAN** : `FR76 1027 8022 0600 0428 8394 011` (CCCM TOULOUSE ST AGNE)
- **Email** : groupe.vrack@gmail.com | **Téléphone** : 06 61 81 27 86
