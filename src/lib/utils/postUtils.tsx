const normalizeDate = (input: number | string | Date): Date => {
    if (!input) return new Date();

    if (input instanceof Date) return input;

    let value = input;
    if (typeof input === 'string') {
        const parsed = Number(input);
        if (!isNaN(parsed)) {
            value = parsed;
        } else {
            return new Date(input);
        }
    }

    if (typeof value === 'number') {
        if (value < 10000000000) {
            return new Date(value * 1000);
        }
        return new Date(value);
    }

    return new Date(input as string);
};

export const getRelativeTime = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';

    if (typeof timestamp === 'string') {
        if (timestamp.includes('lalu') || timestamp === 'Baru saja') {
            return timestamp;
        }
    }

    const now = new Date();
    const past = normalizeDate(timestamp);

    if (isNaN(past.getTime())) return '';

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    return 'Baru saja';
};

export const formatDate = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';

    if (typeof timestamp === 'string' && timestamp.includes(',')) {
        return timestamp;
    }

    const date = normalizeDate(timestamp);

    if (isNaN(date.getTime())) return '';

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
