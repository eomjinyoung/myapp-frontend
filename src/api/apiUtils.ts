export async function handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const errorMessage = data.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    return data as T;
}
