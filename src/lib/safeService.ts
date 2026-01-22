import { extractServerErrorMessage } from './general';

/**
 * Wrapper for service calls that safely catches errors and returns a standardized error response.
 * Use this for GET/read operations in Server Components to prevent crashes.
 * 
 * @param serviceCall - The async service function to execute
 * @param fallbackData - Optional fallback data to return on error
 * @returns The service response or a standardized error object
 */
export async function safeServiceCall<T>(
    serviceCall: () => Promise<T>,
    fallbackData?: Partial<T>
): Promise<T> {
    try {
        const result = await serviceCall();
        return result;
    } catch (error) {
        console.error('Service call failed:', error);
        const errorMessage = extractServerErrorMessage(error);

        return {
            success: false,
            message: errorMessage,
            data: null,
            ...fallbackData,
        } as T;
    }
}

/**
 * Type guard to check if a response indicates an error
 */
export function isServiceError<T>(
    response: T | null | undefined
): response is null | undefined {
    if (!response) return true;
    if (typeof response === 'object' && 'success' in response) {
        return (response as { success: boolean }).success === false;
    }
    return false;
}
