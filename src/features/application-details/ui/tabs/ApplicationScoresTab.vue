<template>
  <div class="grid grid-col-6">
    <v-card
      class="score-card"
      v-if="scoresData"
      v-for="(i, idx) in scoresData"
      :key="`${i.discipline}_${idx}`"
      variant="outlined"
      rounded="lg"
    >
      <v-card-title class="p-2 text-4 score-title">{{ i.discipline }}</v-card-title>
      <v-card-subtitle class="p-2 score-subtitle">{{ i.examType }}</v-card-subtitle>
      <v-card-text class="p-2 pt-0 score-value">{{ i.score }}</v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getAppScores } from '../../model/api.ts'

interface Props {
  id?: number | null
}

const props = defineProps<Props>()
const scoresData = ref<any[] | null>(null)

async function loadData() {
  scoresData.value = null
  if (props.id) {
    scoresData.value = await getAppScores(props.id)
  }
}

watch(
  () => props.id,
  () => {
    void loadData()
  },
  { immediate: true },
)
</script>

<style scoped>
.grid {
  display: grid;
  gap: 0.5rem;
  padding: 0.3rem;
}

.grid-col-6 {
  grid-template-columns: repeat(6, 1fr);
}

.score-title {
  font-weight: 600;
}

.score-subtitle {
  color: #64748b;
  font-size: 0.9rem;
}

.score-value {
  color: #0f172a;
}

.p-2 {
  padding: 0.5rem !important;
}

.pt-0 {
  padding-top: 0 !important;
}

.text-4 {
  font-size: 1rem !important;
}

@media (max-width: 900px) {
  .grid-col-6 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-col-6 {
    grid-template-columns: 1fr;
  }
}
</style>
