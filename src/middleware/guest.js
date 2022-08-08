import store from '../store';

export default function guest({next, router}) {
    console.log('%cguest() ran', 'color: darkseagreen; font-weight: bold;');
    const isAuthenticated = store.state.auth.isAuthenticated;

    // User is logged in but route is only for guests
    if (isAuthenticated) {
        return router.push({ name: 'ProfileOverview' });
    }

    return next();
}