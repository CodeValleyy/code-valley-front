import { onMounted, ref, watch } from 'vue'
import { fetchData } from '@/api/fetchData'
import type { ExecuteCodeResponse, Snippets } from '@/types'
import {
  fetchRawContentFromUrl,
  getContent_type,
  getExtensionFromContentType,
  getLanguageFromExtension,
  languageMap,
  languages,
  parseLanguageFromCodeUrl
} from '@/config/languagesConfig'
import {
  pythonBoilerplate,
  javascriptBoilerplate,
  rustBoilerplate,
  luaBoilerplate
} from '@/config/languagesConfig'
import { useContentStore } from '@/stores/useContentStore'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'vue-router'

const transformNewlines = (str: string): string => {
  return str.replace(/\r?\n/g, '<br>')
}

export function useCodeRunner() {
  const router = useRouter()
  const codeInput = ref<string>(pythonBoilerplate)
  const result = ref<string>('')
  const isLoading = ref<boolean>(false)
  const error = ref<string>('')
  const success = ref<string>('')
  const currentLanguage = ref<string>(languageMap['py'])
  const file = ref<File | null>(null)
  const file_loaded = ref<File | null>(null)
  const downloadLink = ref<string | null>(null)
  const fileContent = ref<string | null>(null)
  const saveDialog = ref(false)
  const loadDialog = ref(false)
  const filename = ref('')
  const contentStore = useContentStore()
  const userStore = useUserStore()
  const isCodeLoaded = ref(false)
  const loadOption = ref('file')
  const selectedSnippet = ref('')

  const snippets = ref(contentStore.snippets as Snippets[])

  onMounted(() => {
    // Load code from query params (usually when user clicks on a edit snippet)
    const snippetId = router.currentRoute.value.query.snippet
    if (snippetId) {
      selectedSnippet.value = snippetId as string
      loadOption.value = 'snippet'
      filename.value = router.currentRoute.value.query.filename as string
      currentLanguage.value = router.currentRoute.value.query.currentLanguage as string
      loadCode()
    }

    console.log('selectedSnippet: ', selectedSnippet.value, 'loadOption: ', loadOption.value)

    const user = userStore.user
    if (!user) {
      userStore
        .fetchUserProfile()
        .then((user) => {
          contentStore.fetchContentsByOwner(user.id).catch((error) => {
            console.error('Error fetching contents:', error)
          })
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error)
        })
    } else {
      if (contentStore.snippets.length === 0) {
        contentStore.fetchContentsByOwner(user.id).catch((error) => {
          console.error('Error fetching contents:', error)
        })
      }
    }
  })

  watch(contentStore, (newVal) => {
    snippets.value = newVal.snippets
  })

  const runCode = async () => {
    if (!codeInput.value.trim()) return

    isLoading.value = true
    error.value = ''
    downloadLink.value = null
    fileContent.value = null

    const formData = new FormData()
    formData.append('language', String(currentLanguage.value))
    formData.append('code', String(codeInput.value))
    if (file.value) {
      formData.append('input_file', file.value)
    }

    try {
      const fetchedResult: ExecuteCodeResponse = await fetchData(formData)
      result.value = fetchedResult.output
        ? transformNewlines(fetchedResult.output)
        : 'Aucun résultat à afficher'
      if (fetchedResult.outputFileContent) {
        const byteArray = Uint8Array.from(atob(fetchedResult.outputFileContent), (char) =>
          char.charCodeAt(0)
        )
        const blob = new Blob([byteArray], { type: 'application/octet-stream' })
        downloadLink.value = URL.createObjectURL(blob)
        fileContent.value = new TextDecoder().decode(byteArray)
      } else {
        downloadLink.value = null
        fileContent.value = null
      }
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.error.error || 'Une erreur est survenue'
      } else {
        error.value = (err as Error).message || 'Une erreur est survenue'
      }
    } finally {
      isLoading.value = false
    }
  }

  const getLanguage = (language: string) => {
    currentLanguage.value = language
  }

  const setBoilerplate = (language: string) => {
    switch (language) {
      case 'python':
        codeInput.value = pythonBoilerplate
        break
      case 'rust':
        codeInput.value = rustBoilerplate
        break
      case 'javascript':
        codeInput.value = javascriptBoilerplate
        break
      case 'lua':
        codeInput.value = luaBoilerplate
        break
      default:
        codeInput.value = ''
    }
  }

  const saveCodeToFile = () => {
    const content_type = getContent_type(currentLanguage.value)
    const blob = new Blob([codeInput.value], { type: content_type })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url

    const extension = getExtensionFromContentType(content_type)
    a.download = filename.value + extension
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    saveDialog.value = false
  }

  const saveCodeToSnippet = async () => {
    if (!codeInput.value.trim()) return
    success.value = ''
    error.value = ''
    const content_type = getContent_type(currentLanguage.value)
    const extension = getExtensionFromContentType(content_type)
    const blob = new Blob([codeInput.value], { type: content_type })
    const file = new File([blob], filename.value + extension)

    try {
      await contentStore.uploadProgram(file)
      saveDialog.value = false
      success.value = 'Programme sauvegardé avec succès dans vos snippets'
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.error.error || 'Une erreur est survenue'
      } else {
        error.value = (err as Error).message || 'Une erreur est survenue'
      }
    }
  }

  const loadCode = async () => {
    if (loadOption.value === 'file' && file_loaded.value) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          codeInput.value = e.target.result as string
          isCodeLoaded.value = true
        }
      }
      reader.readAsText(file_loaded.value)
      const extension = file_loaded.value.name.split('.').pop()
      currentLanguage.value = getLanguageFromExtension(extension ?? '')
    } else if (loadOption.value === 'snippet' && selectedSnippet.value) {
      const snippet = snippets.value.find((s) => s.id === selectedSnippet.value)
      if (snippet) {
        filename.value = snippet.filename
        currentLanguage.value = parseLanguageFromCodeUrl(snippet.code)
        codeInput.value = await fetchRawContentFromUrl(snippet.code)
        isCodeLoaded.value = true
      }
    }
    loadDialog.value = false
  }

  const unloadCode = () => {
    codeInput.value = ''
    file_loaded.value = null
    isCodeLoaded.value = false
    filename.value = ''
    selectedSnippet.value = ''
    currentLanguage.value = languageMap['py']
  }

  const editSnippet = (snippet: Snippets) => {
    router.push({
      name: 'code',
      query: {
        loadOption: 'snippet',
        snippet: snippet.id,
        filename: snippet.filename,
        currentLanguage: parseLanguageFromCodeUrl(snippet.code)
      }
    })
  }

  return {
    codeInput,
    result,
    isLoading,
    error,
    success,
    languages,
    currentLanguage,
    file,
    file_loaded,
    runCode,
    getLanguage,
    downloadLink,
    fileContent,
    setBoilerplate,
    saveCodeToFile,
    saveDialog,
    filename,
    loadDialog,
    snippets,
    saveCodeToSnippet,
    isCodeLoaded,
    loadCode,
    unloadCode,
    loadOption,
    selectedSnippet,
    editSnippet,
    openModal: () => (saveDialog.value = true),
    closeModal: () => (saveDialog.value = false),
    openLoadDialog: () => (loadDialog.value = true),
    closeLoadDialog: () => (loadDialog.value = false)
  }
}
