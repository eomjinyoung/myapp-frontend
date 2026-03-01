export const ENV = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
} as const;

if (!ENV.API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not defined in the environment variables.');
}
