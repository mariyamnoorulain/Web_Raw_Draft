import { createContext } from 'react';

const AppContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
  addNotification: () => {},
  setShowLoginModal: () => {},
  setShowJobModal: () => {}
});

export default AppContext;