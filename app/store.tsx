import { User } from 'firebase/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface State {
    isLoggedIn: boolean,
    userCred: User | null,
    pesterUsername: boolean,
    _hasHydrated?: boolean,
    idToken: string | null,

}

interface Actions {
    loginUser: (user: User) => void,
    logoutUser: () => void,
    setHasHydrated: (state: boolean) => void,
    setIdToken: (token: string) => void,
    setPesterUsername: (state: boolean) => void

}

const initialState: State = {

    pesterUsername: false,
    isLoggedIn: false,
    userCred: null,
    idToken: null,
}


export const useAuthStore = create<State & Actions>()(

    persist(
        (set, get) => ({
            ...initialState,
            _hasHydrated: false,
            loginUser: (user) => set({ userCred: user, isLoggedIn: true }),
            logoutUser: () => set(initialState),
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