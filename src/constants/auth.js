export const DEFAULT_USERS = [
  { id: 'yann', name: 'Yann', role: 'Booking & Diffusion (VRACK, ANYATRA, DMB\'S)', email: 'groupe.vrack@gmail.com', phone: '06.71.10.41.74' },
  { id: 'antoine', name: 'Antoine', role: 'Présidence & Musique (VRACK)', email: 'groupe.vrack@gmail.com' },
  { id: 'ethan', name: 'Ethan', role: 'Trésorerie & Musique (VRACK, 34S)', email: '34smusique@gmail.com', phone: '06.58.56.33.06' },
  { id: 'julien', name: 'Julien', role: 'Responsable TOMAKÉ', email: 'julien.chizallet@yahoo.fr', phone: '07.67.86.45.16' },
  { id: 'rene', name: 'René', role: 'Responsable DOSMOZ', email: 'renditren@yahoo.fr', phone: '06.28.06.07.03' },
  { id: 'vincent', name: 'Vincent', role: 'Responsable YOYU', email: 'vincentvuongmusic@gmail.com', phone: '07.68.59.84.06' },
  { id: 'ivan', name: 'Ivan', role: 'Secrétariat & Musique (VRACK)', email: 'groupe.vrack@gmail.com' },
  { id: 'didier', name: 'Didier', role: 'Régie Technique & Son', email: 'groupe.vrack@gmail.com', phone: '06.72.38.72.82' },
];

export const DEFAULT_PASSWORD = 'vrack'; // Mot de passe par défaut pour l'association

export const getStoredPassword = () => {
  return localStorage.getItem('vrack_site_password') || DEFAULT_PASSWORD;
};

export const setStoredPassword = (newPass) => {
  if (newPass && newPass.trim()) {
    localStorage.setItem('vrack_site_password', newPass.trim());
  }
};

export const getStoredUsers = () => {
  const custom = localStorage.getItem('vrack_custom_users');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_USERS;
};

export const saveCustomUser = (name, role = 'Membre') => {
  const users = getStoredUsers();
  const trimmed = name.trim();
  const existing = users.find(u => u.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;

  const newUser = {
    id: `user-${Date.now()}`,
    name: trimmed,
    role: role,
    email: 'groupe.vrack@gmail.com'
  };
  const updated = [...users, newUser];
  localStorage.setItem('vrack_custom_users', JSON.stringify(updated));
  return newUser;
};

export const getStoredAuthUser = () => {
  const auth = localStorage.getItem('vrack_auth_user');
  if (auth) {
    try {
      return JSON.parse(auth);
    } catch (e) {
      console.error(e);
    }
  }
  return null;
};

export const setStoredAuthUser = (user) => {
  if (user) {
    localStorage.setItem('vrack_auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('vrack_auth_user');
  }
};
