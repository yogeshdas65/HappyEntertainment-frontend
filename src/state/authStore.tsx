// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { mmkvStorage } from "./storage";

// // Define the authStore interface
// interface AuthStore {
//   authUser: Record<string, any> | null;
//   currentOrder: Record<string, any> | null;
//   authstate: any;
//   setAuthUser: (user: Record<string, any>) => void;
//   setCurrentOrder: (order: Record<string, any>) => void;
//   setAuthState: (newState: any) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthStore>()(

//   persist<AuthStore>(
    
//     (set, get) => ({
//       authUser: null,
//       currentOrder: null,
//       authstate: null,

//       setAuthUser: (data: Record<string, any>) => {
//         set({ authUser: data });
//       },
     
//       setCurrentOrder: (order: Record<string, any>) => {
//         set({ currentOrder: order });
//       },

//       setAuthState: (newState: any) => {
//         set({ authstate: newState });
//         mmkvStorage.setItem("authstate", newState); // Persist manually too (redundant but safe)
//       },

//       logout: () => {
//         set({ authUser: null, currentOrder: null, authstate: null });
//         mmkvStorage.clearAll();
//       },
//     }),
//     {
//       name: "Sales-auth-storage",
//       storage: createJSONStorage(() => mmkvStorage),
//       onRehydrateStorage: (state) => {
//         return (persistedState) => {
//           if (persistedState) {
//             // Make sure authstate is synced from storage
//             const restoredState = mmkvStorage.getItem("authstate");
//             if (restoredState) {
//               state?.setAuthState(restoredState);
//             }
//           }
//         };
//       },
//     }
//   )
// );


import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";

interface AuthStore {
  authUser: Record<string, any> | null;
  currentOrder: Record<string, any> | null;
  authstate: any;
  setAuthUser: (user: Record<string, any>) => void;
  setCurrentOrder: (order: Record<string, any>) => void;
  setAuthState: (newState: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authUser: null,
      currentOrder: null,
      authstate: null,

      setAuthUser: (data) => set({ authUser: data }),
      setCurrentOrder: (order) => set({ currentOrder: order }),
      setAuthState: (newState) => set({ authstate: newState }),
      logout: () => {
        set({ authUser: null, currentOrder: null, authstate: null });
        mmkvStorage.clearAll();
      },
    }),
    {
      name: "Sales-auth-storage",               // must match your MMKV ID
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        authUser: state.authUser,
        authstate: state.authstate,
      }),
      // no onRehydrateStorage unless you need to transform data
    }
  )
);