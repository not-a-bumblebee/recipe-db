import { UserCredential } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// interface MyUser extends UserCredential{
//     user:{
//         stsTokenManager:{
//             accessToken:string,
//             expirationTime
//         }
//     }
// }

interface AuthState {
    isLoggedIn: boolean,
    userCred: firebase.auth.UserCredential | null | UserCredential,
    loginUser: (user: firebase.auth.UserCredential | UserCredential) => void,
    logoutUser: () => void,
    _hasHydrated: boolean,
    setHasHydrated: (state: boolean) => void,
    idToken: string | null,
    setIdToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(

    persist(
        (set, get) => ({
            _hasHydrated: false,
            isLoggedIn: false,
            userCred: null,
            idToken: null,
            loginUser: (user) => set({ userCred: user, isLoggedIn: true }),
            logoutUser: () => set({ userCred: null, isLoggedIn: false }),
            setIdToken: (token) => set({ idToken: token }),
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
            name: 'auth-storage', // name of the item in the storage (must be unique)
        },
    ),


)