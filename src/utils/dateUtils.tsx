export const getDateRangeInUnix = (range: string): { start: number | null, end: number | null } => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    switch (range) {
        case '1':
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case '7':
            start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
            start.setHours(0, 0, 0, 0);
            break;
        case '30':
            start = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
            start.setHours(0, 0, 0, 0);
            break;
        case 'all':
        default:
            start = null;
            end = null;
            break;
    }

    const startUnix = start ? Math.floor(start.getTime() / 1000) : null;
    const endUnix = end ? Math.floor(end.getTime() / 1000) : null;

    return { start: startUnix, end: endUnix };
};