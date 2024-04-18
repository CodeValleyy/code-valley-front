<script setup lang="ts">
const props = defineProps<{
  label: string
  color?: string
  hoverColor?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}>()
</script>

<template>
  <div
    :class="[
      color ? `bg-${color}` : 'bg-primary',
      hoverColor ? `hover:bg-${hoverColor}` : 'hover:bg-primaryHover',
      size ? `text-${size}` : 'text-md'
    ]"
    class="text-white py-4 px-6 rounded-3xl shadow-xl cursor-pointer"
  >
    {{ label }}
  </div>
</template>
