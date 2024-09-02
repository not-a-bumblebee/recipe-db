import { User } from 'firebase/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface AuthState {
    isLoggedIn: boolean,
    userCred: User | null,
    loginUser: (user: User) => void,
    logoutUser: () => void,
    _hasHydrated: boolean,
    setHasHydrated: (state: boolean) => void,
    idToken: string | null,
    setIdToken: (token: string) => void,
    pesterUsername: boolean,
    setPesterUsername: (state: boolean) => void

}

export const useAuthStore = create<AuthState>()(

    persist(
        (set, get) => ({
            _hasHydrated: false,
            pesterUsername: false,
            isLoggedIn: false,
            userCred: null,
            idToken: null,
            loginUser: (user) => set({ userCred: user, isLoggedIn: true }),
            logoutUser: () => set({ userCred: null, isLoggedIn: false }),
            setIdToken: (token) => set({ idToken: token }),
            setPesterUsername: (state) => set({ pesterUsername: state }),
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state
                });
            }
        }),

        {
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true)
            },
            name: 'auth-storage', 
        },
    ),


)