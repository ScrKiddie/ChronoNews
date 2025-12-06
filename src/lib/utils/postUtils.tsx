export const getRelativeTime = (timestamp: number): string => {
    if (!timestamp) return '';
    const now = new Date();
    const past = new Date(timestamp * 1000);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    return 'Baru saja';
};

export const formatDate = (timestamp: number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const formattedDate = date
        .toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        .replace('.', '');
    const formattedTime = date
        .toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        .replace('.', ':');
    return `${formattedDate}, ${formattedTime}`;
};
