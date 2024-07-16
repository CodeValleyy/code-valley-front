<template>
  <div>
    <v-autocomplete
      v-model="localCurrentOutputExtension"
      :items="displayedExtensions"
      item-title="text"
      item-value="value"
      label="Extension de l'output"
      class="mb-4"
      clearable
      hide-details
      hide-selected
      solo
    ></v-autocomplete>
    <p class="mb-4">Extensions affichées : {{ displayedExtensions.length }}</p>
    <p class="text-green-700 mb-4">
      Ce système d'affichage d'extension permet de ne pas surcharger le menu déroulant avec des
      extensions inutiles.
    </p>
    <v-switch
      v-model="showAllExtensions"
      :label="
        showAllExtensions
          ? 'Extensions affichées : Toutes'
          : 'Extensions affichées : Seulement les plus courantes'
      "
      :class="showAllExtensions ? 'text-green-700' : 'text-red-700'"
    ></v-switch>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import mimeDb from 'mime-db'
import { useUserStore } from '@/stores/useUserStore'
import { outputExtensions } from '@/config/languagesConfig'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const userStore = useUserStore()

const localCurrentOutputExtension = ref(props.modelValue)
const showAllExtensions = ref(false)

onMounted(() => {
  const savedExtensions = JSON.parse(localStorage.getItem('extensions') ?? '[]')
  const savedCurrentExtension = localStorage.getItem('currentExtension')

  if (savedExtensions.length > 0) {
    showAllExtensions.value = true
    userStore.setExtensions(outputExtensions)
  }

  if (savedCurrentExtension) {
    localCurrentOutputExtension.value = savedCurrentExtension
  }
})

watch(
  () => localCurrentOutputExtension.value,
  (newVal) => {
    emit('update:modelValue', newVal)
    if (newVal) {
      userStore.setCurrentExtension(newVal)
    }
  }
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localCurrentOutputExtension.value) {
      localCurrentOutputExtension.value = newVal
    }
  }
)

const outputRestrictedExtensions = [
  { text: 'JSON File', value: '.json' },
  { text: 'CSV File', value: '.csv' },
  { text: 'XML File', value: '.xml' },
  { text: 'HTML File', value: '.html' },
  { text: 'Markdown File', value: '.md' },
  { text: 'JPEG Image', value: '.jpg' },
  { text: 'PNG Image', value: '.png' },
  { text: 'HEIC Image', value: '.heic' },
  { text: 'Text File', value: '.txt' },
  { text: 'YAML File', value: '.yaml' },
  { text: 'PDF File', value: '.pdf' }
]
const displayedExtensions = computed(() => {
  return showAllExtensions.value ? outputExtensions : outputRestrictedExtensions
})

watch(
  () => showAllExtensions.value,
  (newValue) => {
    if (newValue) {
      const outputExtensions = Object.keys(mimeDb).reduce(
        (acc: { text: string; value: string }[], mimeType) => {
          const extensions = mimeDb[mimeType]?.extensions
          if (extensions) {
            extensions.forEach((extension) => {
              acc.push({ text: `${extension.toUpperCase()} File`, value: `.${extension}` })
            })
          }
          return acc
        },
        []
      )
      userStore.setExtensions(outputExtensions)
    } else {
      userStore.setExtensions([])
    }
  }
)
</script>
