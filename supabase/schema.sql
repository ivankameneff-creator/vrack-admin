-- ==============================================================================
-- SCHEMA POSTGRESQL POUR LA BASE DE DONNEES VRACK ADMIN (SUPABASE)
-- Association "La Sauce en Vrac" - Devis, Groupes & Membres
-- ==============================================================================

-- 1. TABLE DES UTILISATEURS / MEMBRES DU BUREAU
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Membre',
  email TEXT,
  phone TEXT,
  password TEXT DEFAULT 'vrack',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE DES GROUPES & PROJETS DE LA COMPAGNIE
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  baseline TEXT,
  default_musicians INT DEFAULT 4,
  default_duration TEXT,
  instrumentation TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  socials TEXT,
  description TEXT,
  color TEXT DEFAULT 'amber',
  badge_class TEXT,
  initials TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE DES DEVIS
CREATE TABLE IF NOT EXISTS devis (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  validity_days INT DEFAULT 30,
  payment_terms TEXT DEFAULT 'Règlement sous 30 jours par virement ou chèque',
  client JSONB NOT NULL DEFAULT '{}'::jsonb,
  event JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  discount NUMERIC DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'Brouillon',
  created_by JSONB DEFAULT '{}'::jsonb,
  group_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_devis_number ON devis(number);
CREATE INDEX IF NOT EXISTS idx_devis_status ON devis(status);
CREATE INDEX IF NOT EXISTS idx_devis_date ON devis(date DESC);

-- Activer Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (lecture et écriture ouvertes avec clé API publique)
CREATE POLICY "Accès public lecture users" ON users FOR SELECT USING (true);
CREATE POLICY "Accès public modification users" ON users FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accès public lecture groups" ON groups FOR SELECT USING (true);
CREATE POLICY "Accès public modification groups" ON groups FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accès public lecture devis" ON devis FOR SELECT USING (true);
CREATE POLICY "Accès public modification devis" ON devis FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INSERTION DES DONNEES INITIALES (SEED)
-- ==============================================================================

-- Membres du bureau
INSERT INTO users (id, name, role, email, phone)
VALUES
  ('yann', 'Yann', 'Booking & Diffusion (VRACK, ANYATRA, DMB''S)', 'groupe.vrack@gmail.com', '06.71.10.41.74'),
  ('antoine', 'Antoine', 'Présidence & Musique (VRACK)', 'groupe.vrack@gmail.com', ''),
  ('ethan', 'Ethan', 'Trésorerie & Musique (VRACK, 34S)', '34smusique@gmail.com', '06.58.56.33.06'),
  ('julien', 'Julien', 'Responsable TOMAKÉ', 'julien.chizallet@yahoo.fr', '07.67.86.45.16'),
  ('rene', 'René', 'Responsable DOSMOZ', 'renditren@yahoo.fr', '06.28.06.07.03'),
  ('vincent', 'Vincent', 'Responsable YOYU', 'vincentvuongmusic@gmail.com', '07.68.59.84.06'),
  ('ivan', 'Ivan', 'Secrétariat & Musique (VRACK)', 'groupe.vrack@gmail.com', ''),
  ('didier', 'Didier', 'Régie Technique & Son', 'groupe.vrack@gmail.com', '06.72.38.72.82')
ON CONFLICT (id) DO NOTHING;

-- Les 7 groupes officiels de la Compagnie en Vrack
INSERT INTO groups (id, name, genre, baseline, default_musicians, default_duration, instrumentation, contact_name, contact_phone, contact_email, website, socials, description, color, badge_class, initials)
VALUES
  (
    'vrack',
    'VRACK',
    'Musiques tziganes festives',
    'Musiques tziganes festives — 11 musiciens',
    11,
    '1h30 à 2h',
    'Guitares, basse, batterie, clarinette, accordéon, xylophone, flûte traversière, percussion, violon, chant',
    'Yann',
    '06.71.10.41.74',
    'groupe.vrack@gmail.com',
    'https://www.vrack.fr/',
    'facebook.com/vrack.groupe',
    'Ancré dans les folklores d’Europe centrale, VRACK développe une musique généreuse, métissée et sans frontières (tzigane, rock, jazz, valse et celtique).',
    'amber',
    'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'V'
  ),
  (
    'anyatra',
    'ANYATRA',
    'Musiques du monde & danse gitane',
    'Musiques du monde & danse gitane — 4 musiciens + 1 danseuse',
    5,
    '1h15',
    'Bouzouki grec, viola brésilienne, basse, batterie, clarinette, chant et danse !',
    'Yann',
    '06.71.10.41.74',
    'yann.robert48@gmail.com',
    'https://anyatra.wixsite.com/anyatra',
    'facebook.com/Groupe.Anyatra',
    'Plus qu’un simple concert, un spectacle dépaysant avec instrumentation atypique, chants hypnotiques et danses kalbelia envoûtantes.',
    'emerald',
    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'A'
  ),
  (
    'tomake',
    'TOMAKÉ',
    'Chanson poétique et festive',
    'Chanson poétique et festive — 5 musicien·nes',
    5,
    '1h30 à 1h45',
    'Chant, guitares acoustiques, basse, violon, percussions',
    'Julien',
    '07.67.86.45.16',
    'julien.chizallet@yahoo.fr',
    '',
    'facebook.com/profile.php?id=61561905141727',
    'Cinq artistes autour d’un répertoire de chansons aux couleurs multiples : rock, latines, balkanes et festives, porté par la voix de Maude.',
    'rose',
    'bg-rose-500/20 text-rose-400 border-rose-500/30',
    'T'
  ),
  (
    'dosmoz',
    'DOSMOZ',
    'Duo métissé — tzigane, klezmer, manouche',
    'Duo métissé — musiques du monde, tzigane, klezmer, manouche',
    2,
    '1h15 - 1h30',
    'Violon, guitare, chant',
    'René',
    '06.28.06.07.03',
    'renditren@yahoo.fr',
    'https://soundcloud.com/dosmoz-musique',
    'facebook.com/profile.php?id=61571866931932',
    'Formule complice traversant musiques tziganes, klezmer, manouches, orientales et irlandaises. Une large place à l’improvisation et à la proximité.',
    'cyan',
    'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'D'
  ),
  (
    'dmbs',
    'DMB''S',
    'Musique bulgare festive',
    'Musique bulgare festive — 4 musiciens',
    4,
    '1h15',
    'Gadulka, guitare, batterie, basse, chant',
    'Yann',
    '06.71.10.41.74',
    'dennismonnkeyband@gmail.com',
    'https://sites.google.com/view/dennismonkeyband',
    'instagram.com/dennismonkeyband',
    'Porté par Dennis (gadulka & chant), exploration d’un répertoire bulgare et compositions originales dans une formule dansante, festive et dépaysante.',
    'orange',
    'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'M'
  ),
  (
    'yoyu',
    'YOYU',
    'Quartet de jazz',
    'Quartet de jazz — 4 musiciens',
    4,
    '1h30 (ou 2x1h)',
    'Violon, contrebasse, clarinette, batterie',
    'Vincent',
    '07.68.59.84.06',
    'vincentvuongmusic@gmail.com',
    'https://linktr.ee/vincentvuongmusic',
    'instagram.com/vincentmusic11',
    'Quartet de jazz toulousain porté par Vincent Vuong à la clarinette et à la composition, au croisement de l’improvisation et de structures raffinées.',
    'indigo',
    'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Y'
  ),
  (
    '34s',
    '34S',
    'Rap poétique',
    'Rap poétique — 2 artistes',
    2,
    '35 min',
    'Rap / chants, bande sonore',
    'Ethan',
    '06.58.56.33.06',
    '34smusique@gmail.com',
    '',
    'instagram.com/34s_musique',
    'Duo de rap explorant l’intime à travers des textes poétiques et sensibles. Entre introspection, émotion et mélodie, une parole incarnée et sincère.',
    'fuchsia',
    'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
    '3'
  )
ON CONFLICT (id) DO NOTHING;
