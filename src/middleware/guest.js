import store from '../store';

export default function guest({next, router}) {
    const isAuthenticated = store.state.auth.isAuthenticated;

    // User is logged in but route is only for guests
    if (isAuthenticated) {
        return router.push({ name: 'ProfileOverview' });
    }

    return next();
}