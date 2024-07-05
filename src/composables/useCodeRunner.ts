import { onMounted, ref, watch } from 'vue';
import { fetchData } from '@/api/fetchData';
import type { ExecuteCodeResponse, Snippets } from '@/types';
import { getContent_type, getExtensionFromContentType, languages } from '@/config/languagesConfig';
import { pythonBoilerplate, javascriptBoilerplate, rustBoilerplate, luaBoilerplate } from '@/config/languagesConfig'
import { useContentStore } from '@/stores/useContentStore';
import { useUserStore } from '@/stores/useUserStore';

const transformNewlines = (str: string): string => {
    return str.replace(/\r?\n/g, '<br>');
};

export function useCodeRunner() {
    const codeInput = ref<string>(pythonBoilerplate);
    const result = ref<string>('');
    const isLoading = ref<boolean>(false);
    const error = ref<string>('');
    const success = ref<string>('');
    const currentLanguage = ref<string>(languages[0]);
    const file = ref<File | null>(null);
    const file_loaded = ref<File | null>(null);
    const downloadLink = ref<string | null>(null);
    const fileContent = ref<string | null>(null);
    const saveDialog = ref(false);
    const loadDialog = ref(false);
    const filename = ref('');
    const contentStore = useContentStore();
    const userStore = useUserStore();

    const snippets = ref(contentStore.snippets as Snippets[]);

    onMounted(() => {
        const user = userStore.user;
        if (!user) {
            userStore.fetchUserProfile()
                .then((user) => {
                    contentStore.fetchContentsByOwner(user.id).catch((error) => {
                        console.error('Error fetching contents:', error);
                    });
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                });
        } else {
            if (contentStore.snippets.length === 0) {
                contentStore.fetchContentsByOwner(user.id).catch((error) => {
                    console.error('Error fetching contents:', error);
                });
            }
        }
    });

    watch(contentStore, (newVal) => {
        snippets.value = newVal.snippets;
    });


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

    const saveCodeToFile = () => {
        const content_type = getContent_type(currentLanguage.value);
        console.log(content_type);
        console.log(filename.value);

        const blob = new Blob([codeInput.value], { type: content_type });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        const extension = getExtensionFromContentType(content_type);
        a.download = filename.value + extension;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        saveDialog.value = false;
    };

    const saveCodeToSnippet = async () => {
        if (!codeInput.value.trim()) return;
        success.value = '';
        error.value = '';
        const content_type = getContent_type(currentLanguage.value);
        const extension = getExtensionFromContentType(content_type);
        const blob = new Blob([codeInput.value], { type: content_type });
        const file = new File([blob], filename.value + extension);

        try {
            await contentStore.uploadProgram(file);
            saveDialog.value = false;
            success.value = 'Programme sauvegardé avec succès dans vos snippets';
        } catch (err: any) {
            if (err.response) {
                error.value = err.response.data.error.error || 'Une erreur est survenue';
            } else {
                error.value = (err as Error).message || 'Une erreur est survenue';
            }
        }
    }

    return {
        codeInput, result, isLoading, error,
        success, languages, currentLanguage,
        file, file_loaded,
        runCode, getLanguage,
        downloadLink, fileContent, setBoilerplate,
        saveCodeToFile,
        saveDialog, filename,
        loadDialog, snippets,
        saveCodeToSnippet,
        openModal: () => saveDialog.value = true,
        closeModal: () => saveDialog.value = false,
        openLoadDialog: () => loadDialog.value = true,
        closeLoadDialog: () => loadDialog.value = false
    };
}
