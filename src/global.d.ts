interface Disqus {
    reset(options: { reload: boolean; config?: () => void }): void;
}

interface Window {
    DISQUS?: Disqus;
}
