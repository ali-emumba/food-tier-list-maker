import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User store for caching user details and admin status
export const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      userLoading: true,
      userError: null,

      // Admin emails - could be moved to environment variables in production
      adminEmails: [
        'ali.usman@foodtier.com',
        'syeda.duaa@foodtier.com'
      ],

      // Actions
      setUser: (user) => {
        const isAdmin = user ? get().checkIsAdmin(user.email) : false;
        set({ 
          user, 
          isAuthenticated: !!user,
          isAdmin,
          userLoading: false,
          userError: null
        });
      },

      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
        isAdmin: false,
        userLoading: false,
        userError: null
      }),

      setUserLoading: (loading) => set({ userLoading: loading }),

      setUserError: (error) => set({ userError: error, userLoading: false }),

      // Helper function to check admin status
      checkIsAdmin: (email) => {
        const { adminEmails } = get();
        return email && adminEmails.includes(email);
      },

      // Update admin emails (for future flexibility)
      updateAdminEmails: (emails) => set({ adminEmails: emails }),

      // Get user display name
      getUserDisplayName: () => {
        const { user } = get();
        return user?.displayName || user?.email || 'User';
      },

      // Check if user has specific admin privileges (extensible for future)
      hasAdminPrivilege: (privilege) => {
        const { isAdmin } = get();
        // For now, all admin users have all privileges
        // Could be extended to have role-based permissions
        return isAdmin;
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential user data, not sensitive info
      partialize: (state) => ({
        user: state.user ? {
          uid: state.user.uid,
          email: state.user.email,
          displayName: state.user.displayName
        } : null,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      }),
    }
  )
);
