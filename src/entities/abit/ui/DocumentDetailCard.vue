<template>
  <div class="document-details">
    <FileViewer :document="document" :api-url="getFileApiUrl(document)" />
    <div class="approve-form">
      <v-select
        v-model="status"
        :items="statuses"
        label="Статус"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
      />
      <v-btn color="primary" @click="onClick">Сохранить</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BASE_URL, endpoints } from '@/entities/abit/api/config'
import { updateDocument } from '@/entities/abit/model/api'
import FileViewer from '@/shared/ui/file-viewer/FileViewer.vue'

const props = defineProps({
  document: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['document-updated'])

const statuses = ['Не проверено', 'Проверено', 'Отклонено']
const status = ref('')

function getFileApiUrl(document: any) {
  if (!document?.fileId || !document?.fileGuid) {
    return null
  }

  return `${BASE_URL}${endpoints.GET_DOCUMENTS}/file/${document.fileId}/${document.fileGuid}`
}

async function onClick() {
  if (!status.value) return

  try {
    const response = await updateDocument({
      DocumentCode: props.document.code,
      NewStatus: status.value,
    })
    emit('document-updated', response)
  } catch (error) {
    console.error('Error updating document:', error)
  }
}
</script>

<style scoped>
.document-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
}

.document-photo {
  width: 100%;
  max-height: 1000px;
  object-fit: contain;
}

.approve-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

@media (max-width: 768px) {
  .document-details {
    padding: 0.5rem;
  }

  .approve-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 50vw;
  }

  .approve-form :deep(.v-input),
  .approve-form :deep(.v-btn) {
    width: 100%;
  }
}
</style>
