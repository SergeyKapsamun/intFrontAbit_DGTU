<template>
  <div class="achievement-details">
    <FileViewer :document="achievement" :api-url="getFileApiUrl(achievement)" />
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

      <v-text-field
        :model-value="score"
        type="number"
        label="Баллы"
        variant="outlined"
        density="comfortable"
        hide-details
        @update:model-value="onScoreChange"
      />

      <v-btn color="primary" @click="onClick">Сохранить</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BASE_URL, endpoints } from '@/entities/abit/api/config'
import { updateAchievement } from '@/entities/abit/model/api'
import FileViewer from '@/shared/ui/file-viewer/FileViewer.vue'

const props = defineProps({
  achievement: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['achievement-updated'])

const statuses = ['Не проверено', 'Проверено', 'Отклонено']
const status = ref('')
const score = ref(0)

function getFileApiUrl(achievement: any) {
  if (!achievement?.fileId || !achievement?.fileGuid) {
    return null
  }

  return `${BASE_URL}${endpoints.GET_DOCUMENTS}/file/${achievement.fileId}/${achievement.fileGuid}`
}

function onScoreChange(value: string | number | null) {
  const raw = Number(value)
  score.value = Number.isFinite(raw) ? raw : 0
}

async function onClick() {
  if (!status.value) return

  try {
    const maxBall = Number(props.achievement.maxBall) || 0
    const response = await updateAchievement({
      Code: props.achievement.code,
      NewStatus: status.value,
      Counted: Math.min(score.value, maxBall || score.value),
      MaxBall: maxBall,
      BallChanged: true,
    })
    emit('achievement-updated', response)
  } catch (error) {
    console.error('Error updating achievement:', error)
  }
}
</script>

<style scoped>
.achievement-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
}

.achievement-photo {
  width: 100%;
  max-height: 1000px;
  object-fit: contain;
}

.approve-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  width: 100%;
}

@media (max-width: 768px) {
  .achievement-details {
    padding: 0.5rem;
  }

  .approve-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 50vw;
  }

  .approve-form > * {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .approve-form :deep(.v-btn) {
    width: 100% !important;
  }
}
</style>
