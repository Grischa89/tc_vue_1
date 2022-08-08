import store from '../store';

export default function auth({ next, router }) {
    console.log('%cauth() ran', 'color: darkseagreen; font-weight: bold;');
    const isAuthenticated = store.state.auth.isAuthenticated;

    if (!isAuthenticated) {
        console.log('%cUser not authenticated!', 'color: red; font-weight: bold;');
        return router.push({ name: 'LogIn'});
    }
  
    return next();
  }