export const scrollToTop = () => {
    if (window.innerWidth <= 720) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};