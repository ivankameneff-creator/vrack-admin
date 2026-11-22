import { getSupabaseClient, getSupabaseConfig } from './supabase';
import { GROUPS_LIST } from '../constants/groups';
import { DEFAULT_USERS, getStoredUsers, saveCustomUser } from '../constants/auth';

/**
 * Service de base de données unifié (Supabase Cloud avec Fallback Local)
 */

export const dbService = {
  /**
   * Vérifie le statut de connexion à la base de données
   */
  async checkStatus() {
    const { isConfigured, url } = getSupabaseConfig();
    if (!isConfigured) {
      return {
        isCloud: false,
        connected: false,
        type: 'local',
        label: 'Mode Local (LocalStorage)',
        message: 'Base locale active. Configurez vos clés Supabase pour synchroniser en temps réel.'
      };
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('groups').select('id').limit(1);

      if (error) {
        return {
          isCloud: true,
          connected: false,
          type: 'error',
          label: 'Erreur Supabase',
          message: `Connexion refusée : ${error.message}. Vérifiez les tables et les clés.`
        };
      }

      return {
        isCloud: true,
        connected: true,
        type: 'cloud',
        label: 'PostgreSQL Cloud Connecté',
        message: `Connecté à Supabase (${url.replace(/https:\/\/(.*?)\..*/, '$1')})`
      };
    } catch (err) {
      return {
        isCloud: true,
        connected: false,
        type: 'error',
        label: 'Erreur de connexion',
        message: err.message || 'Impossible de joindre Supabase.'
      };
    }
  },

  // ============================================================================
  // UTILISATEURS / MEMBRES
  // ============================================================================
  async getUsers() {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').order('name');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Fallback local pour les utilisateurs :', err);
      }
    }
    return getStoredUsers();
  },

  async saveUser(user) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('users').upsert({
          id: user.id || `user-${Date.now()}`,
          name: user.name,
          role: user.role || 'Membre',
          email: user.email || '',
          phone: user.phone || '',
          password: user.password || 'vrack'
        });
        if (!error) return user;
      } catch (err) {
        console.warn('Erreur Supabase saveUser :', err);
      }
    }
    return saveCustomUser(user.name, user.role);
  },

  // ============================================================================
  // GROUPES DE LA COMPAGNIE
  // ============================================================================
  async getGroups() {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('groups').select('*').order('name');
        if (!error && data && data.length > 0) {
          // Formatage compatible avec GROUPS_LIST
          return data.map(g => ({
            id: g.id,
            name: g.name,
            genre: g.genre,
            baseline: g.baseline,
            defaultMusicians: g.default_musicians,
            defaultDuration: g.default_duration,
            instrumentation: g.instrumentation,
            contact: {
              name: g.contact_name,
              phone: g.contact_phone,
              email: g.contact_email
            },
            website: g.website,
            socials: g.socials,
            description: g.description,
            color: g.color || 'amber',
            badgeClass: g.badge_class || 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            initials: g.initials || g.name[0]
          }));
        }
      } catch (err) {
        console.warn('Fallback local pour les groupes :', err);
      }
    }
    return GROUPS_LIST;
  },

  async saveGroup(group) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('groups').upsert({
          id: group.id,
          name: group.name,
          genre: group.genre,
          baseline: group.baseline,
          default_musicians: group.defaultMusicians,
          default_duration: group.defaultDuration,
          instrumentation: group.instrumentation,
          contact_name: group.contact?.name,
          contact_phone: group.contact?.phone,
          contact_email: group.contact?.email,
          website: group.website,
          socials: group.socials,
          description: group.description,
          color: group.color,
          badge_class: group.badgeClass,
          initials: group.initials
        });
        if (error) throw error;
      } catch (err) {
        console.error('Erreur Supabase saveGroup :', err);
      }
    }
    return group;
  },

  // ============================================================================
  // DEVIS
  // ============================================================================
  async getDevisList() {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('devis')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data) {
          return data.map(d => ({
            id: d.id,
            number: d.number,
            date: d.date,
            validityDays: d.validity_days,
            paymentTerms: d.payment_terms,
            client: d.client || {},
            event: d.event || {},
            items: d.items || [],
            discount: Number(d.discount) || 0,
            notes: d.notes || '',
            status: d.status || 'Brouillon',
            createdBy: d.created_by || {},
            group: d.group_data || {},
            createdAt: d.created_at,
            updatedAt: d.updated_at
          }));
        }
      } catch (err) {
        console.warn('Fallback local pour les devis :', err);
      }
    }

    // Fallback localStorage
    const local = localStorage.getItem('vrack_saved_devis_list');
    return local ? JSON.parse(local) : [];
  },

  async saveDevis(devis) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const payload = {
          id: devis.id,
          number: devis.number,
          date: devis.date,
          validity_days: devis.validityDays || 30,
          payment_terms: devis.paymentTerms || '',
          client: devis.client || {},
          event: devis.event || {},
          items: devis.items || [],
          discount: Number(devis.discount) || 0,
          notes: devis.notes || '',
          status: devis.status || 'Brouillon',
          created_by: devis.createdBy || {},
          group_data: devis.group || {},
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('devis').upsert(payload);
        if (error) {
          console.error('Erreur Supabase upsert devis :', error);
        }
      } catch (err) {
        console.error('Erreur Supabase saveDevis :', err);
      }
    }

    // Toujours mettre à jour le cache local pour offline resilience
    const local = localStorage.getItem('vrack_saved_devis_list');
    const list = local ? JSON.parse(local) : [];
    const index = list.findIndex(d => d.id === devis.id);
    let updated;
    if (index >= 0) {
      updated = [...list];
      updated[index] = devis;
    } else {
      updated = [devis, ...list];
    }
    localStorage.setItem('vrack_saved_devis_list', JSON.stringify(updated));
    return devis;
  },

  async deleteDevis(id) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('devis').delete().eq('id', id);
      } catch (err) {
        console.error('Erreur Supabase deleteDevis :', err);
      }
    }

    // Supprimer également du cache local
    const local = localStorage.getItem('vrack_saved_devis_list');
    if (local) {
      const list = JSON.parse(local).filter(d => d.id !== id);
      localStorage.setItem('vrack_saved_devis_list', JSON.stringify(list));
    }
    return true;
  }
};
