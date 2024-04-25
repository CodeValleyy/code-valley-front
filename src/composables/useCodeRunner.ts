import { ref } from 'vue';
import { fetchData } from '@/api/fetchData';
import type { ExecuteCodeRequest } from '@/types';
import { languages } from '@/config/languagesConfig';

export function useCodeRunner() {
  const codeInput = ref<string>('');
  const result = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string>('');
  const currentLanguage = ref<string>(languages[0][0]);
  const runCode = async () => {
    if (!codeInput.value.trim()) return;

    isLoading.value = true;
    error.value = '';
    try {
      const fetchedResult = await fetchData({
        language: currentLanguage.value,
        code: codeInput.value
      });
      result.value = fetchedResult || "Aucun résultat à afficher";
    } catch (err) {
      error.value = (err as Error).message || 'Une erreur est survenue';
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
