import store from '../store';

export default function staff({ to, next, router }) {
    const isAuthenticated = store.state.auth.isAuthenticated;
    const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

    if (!isAuthenticated) {
        store.commit('setToRouteName', to.name);
        return router.push({ name: 'LogIn'});
    }

    if (!tc_user.is_staff) {
        return router.push({ name: 'Home' });
    }

    return next();
}