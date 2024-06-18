import { ref } from 'vue';
import { fetchData } from '@/api/fetchData';
import type { ExecuteCodeRequest } from '@/types';
import { languages } from '@/config/languagesConfig';

const transformNewlines = (str: string): string => {
    return str.replace(/\r?\n/g, '<br>');
};

export function useCodeRunner() {
    const codeInput = ref<string>('');
    const result = ref<string>('');
    const isLoading = ref<boolean>(false);
    const error = ref<string>('');
    const currentLanguage = ref<string>(languages[0]);
    const runCode = async () => {
        if (!codeInput.value.trim()) return;

        isLoading.value = true;
        error.value = '';
        try {
            const executeCodeRequest: ExecuteCodeRequest = {
                language: currentLanguage.value,
                code: codeInput.value
            };

            const fetchedResult = await fetchData(executeCodeRequest);
            result.value = fetchedResult ? transformNewlines(fetchedResult) : "Aucun résultat à afficher";

            result.value = fetchedResult || "Aucun résultat à afficher";
        } catch (err: any) {
            if (err.response) {
                error.value = err.response.data.error.error || 'Une erreur est survenue';
            } else {
                error.value = (err as Error).message || 'Une erreur est survenue';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const getLanguage = (language: string) => {
        currentLanguage.value = language;
    };


    return {
        codeInput, result, isLoading, error, languages, currentLanguage, runCode, getLanguage
    };
}
