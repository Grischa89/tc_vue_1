import store from '../store';

export default function staff({ next, router }) {
    const isAuthenticated = store.state.auth.isAuthenticated;
    const tc_user = JSON.parse(localStorage.getItem('tc_user')) || {};

    if (!isAuthenticated) {
        return router.push({ name: 'LogIn'});
    }

    if (!tc_user.is_staff) {
        console.log('%cUser not staff!', 'color: red; font-weight: bold;');
        return router.push({ name: 'Home' });
    }

    return next();
}