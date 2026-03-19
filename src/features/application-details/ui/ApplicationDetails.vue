<template>
  <ApplicationTabs :data="applicationData" v-if="applicationData" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getAppData } from "../model/api.ts";
import ApplicationTabs from './ApplicationTabs.vue'

interface ApplicationDetailsProps {
  data?: { id?: number | null } | null;
}

const props = defineProps<ApplicationDetailsProps>();
const applicationData = ref<Record<string, any> | null>(null);
const error = ref<string | null>(null);

async function loadApplicationData() {
  applicationData.value = null;
  error.value = null;

  const appId = props.data?.id ?? null;
  if (!appId) {
    return;
  }

  applicationData.value = (await getAppData(appId)) as Record<string, any> | null;
}

watch(
  () => props.data?.id,
  () => {
    void loadApplicationData();
  },
  { immediate: true },
);
</script>

<style scoped></style>
