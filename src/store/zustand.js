// NavigationStore.js
import { create } from 'zustand';


const useNavigationStore = create((set) => ({
  currentRoute: '/',
  navigate: (route) => {
    set({ currentRoute: route });
  },
}));

export default useNavigationStore;
