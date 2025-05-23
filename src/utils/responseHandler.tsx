export function handleResponseError(error: any): never {
    const isServerError = error?.response?.status === 500;
    const message =
        isServerError
            ? "Kesalahan server, coba lagi nanti"
            : error?.response?.data?.error || "Terjadi kesalahan jaringan";

    throw new Error(message);
}
