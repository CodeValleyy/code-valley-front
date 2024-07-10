<script setup lang="ts">
import type { GroupInput } from '@/types/GroupInput'
import { ref } from 'vue'
import { useGroup } from '@/composables/useGroup'
import type { GroupResponse } from '@/types/GroupResponse'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { updateGroup, getOneWithId } = useGroup()

const groupId = route.params.id

const group = ref<GroupResponse>(await getOneWithId(String(groupId)))

const groupInput = ref<GroupInput>({
  name: group.value.name,
  description: group.value.description,
  isPublic: group.value.isPublic,
  file: null
})

const photoToUpload = ref<{ fileURL: string; imageURL: string | ArrayBuffer | null; image: any }>()

const onFilePicked = (event: any) => {
  const files = event.target.files
  const fileReader = new FileReader()
  let imageURL
  fileReader.addEventListener('load', () => {
    imageURL = fileReader.result
  })
  fileReader.readAsDataURL(files[0])
  const image = files[0]
  const fileURL = URL.createObjectURL(files[0])
  photoToUpload.value = {
    fileURL: fileURL,
    imageURL: imageURL || '',
    image: image
  }
  groupInput.value.file = files[0]
}

const onSubmit = async () => {
  console.log(groupInput.value)
  await updateGroup(groupInput.value, group.value.id)
  router.push('groups/' + group.value.id)
}

const getAvatar = () => {
  return 'https://yt3.googleusercontent.com/Pjk-KU0aJH978tDhdO05PgUx8j3i1OvqC4-U0L_3EUdJo0eBUrQ-cb1g2ZJiTYTlk5pq_0gy=s900-c-k-c0x00ffffff-no-rj'
}
</script>
<template>
  <v-container>
    <div class="text-3xl font-bold text-primary mb-10">Editer le Groupe :</div>
    <form @submit.prevent="onSubmit" class="flex flex-col w-full items-start">
      <div class="w-full flex justify-between border rounded shadow p-4 mb-4">
        <div class="w-1/2 flex flex-col">
          <div class="mb-2">Nom :</div>
          <input
            type="text"
            class="border py-1 px-2 w-10/12 mb-6"
            v-model="groupInput.name"
            placeholder="nom du groupe..."
          />
          <div class="mb-2">Description :</div>
          <textarea
            class="border py-1 px-2 w-10/12 mb-6"
            v-model="groupInput.description"
            placeholder="description du groupe..."
          ></textarea>

          <v-radio-group v-model="groupInput.isPublic" inline>
            <v-radio label="Public" :value="true"></v-radio>
            <v-radio label="Privé" :value="false"></v-radio>
          </v-radio-group>
        </div>
        <div class="w-1/2 flex flex-col mb-4">
          <div class="mb-2">Avatar :</div>
          <img
            v-if="photoToUpload"
            :src="photoToUpload.fileURL"
            class="h-5/6 max-w-full mb-4 object-contain"
            alt="Avatar"
          />
          <img
            v-else
            :src="group.avatar"
            class="h-5/6 max-w-full mb-4 object-contain"
            alt="Avatar"
          />
          <input type="file" accept="image/*" class="p-2" @change="onFilePicked" />
        </div>
      </div>

      <button
        type="submit"
        class="py-2 px-4 shadow bg-secondaryTailwind hover:bg-secondaryHover text-white rounded"
      >
        Valider
      </button>
    </form>
  </v-container>
</template>
