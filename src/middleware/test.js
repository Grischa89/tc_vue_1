export default function test({ next, to }) {
    console.log('%ctest middleware', 'color: cornflowerblue; font-weight: bold;', to.name, next);

    return next();
}