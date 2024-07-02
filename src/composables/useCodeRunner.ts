import { ref } from 'vue';
import { fetchData } from '@/api/fetchData';
import type { ExecuteCodeRequest, ExecuteCodeResponse } from '@/types';
import { languages } from '@/config/languagesConfig';
import { pythonBoilerplate, javascriptBoilerplate, rustBoilerplate, luaBoilerplate } from '@/config/languagesConfig'

const transformNewlines = (str: string): string => {
    return str.replace(/\r?\n/g, '<br>');
};

export function useCodeRunner() {
    const codeInput = ref<string>(pythonBoilerplate);
    const result = ref<string>('');
    const isLoading = ref<boolean>(false);
    const error = ref<string>('');
    const currentLanguage = ref<string>(languages[0]);
    const file = ref<File | null>(null);
    const downloadLink = ref<string | null>(null);
    const fileContent = ref<string | null>(null);

    const runCode = async () => {
        if (!codeInput.value.trim()) return;

        isLoading.value = true;
        error.value = '';
        downloadLink.value = null;
        fileContent.value = null;

        const formData = new FormData();
        formData.append("language", String(currentLanguage.value));
        formData.append("code", String(codeInput.value));
        if (file.value) {
            formData.append("input_file", file.value);
        }

        try {
            const fetchedResult: ExecuteCodeResponse = await fetchData(formData);
            result.value = fetchedResult.output ? transformNewlines(fetchedResult.output) : "Aucun résultat à afficher";
            if (fetchedResult.outputFileContent) {
                const byteArray = Uint8Array.from(atob(fetchedResult.outputFileContent), char => char.charCodeAt(0));
                const blob = new Blob([byteArray], { type: 'application/octet-stream' });
                downloadLink.value = URL.createObjectURL(blob);
                fileContent.value = new TextDecoder().decode(byteArray);
            } else {
                downloadLink.value = null;
                fileContent.value = null;
            }

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

    const setBoilerplate = (language: string) => {
        switch (language) {
            case 'python':
                codeInput.value = pythonBoilerplate;
                break;
            case 'rust':
                codeInput.value = rustBoilerplate;
                break;
            case 'javascript':
                codeInput.value = javascriptBoilerplate;
                break;
            case 'lua':
                codeInput.value = luaBoilerplate;
                break;
            default:
                codeInput.value = '';
        }
    }

    return {
        codeInput, result, isLoading, error, languages, currentLanguage, file, runCode, getLanguage, downloadLink, fileContent, setBoilerplate
    };
}
