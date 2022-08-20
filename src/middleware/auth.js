import store from '../store';

export default function auth({ to, next, router }) {
    const isAuthenticated = store.state.auth.isAuthenticated;

    if (!isAuthenticated) {
        store.commit('setToRouteName', to.name);
        return router.push({ name: 'LogIn' });
    }
  
    return next();
  }