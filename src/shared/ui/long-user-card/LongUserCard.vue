<template>
  <div class="long-user-card-wrapper">
    <v-card class="user-card" elevation="2">
      <div class="user-header">
        <div class="user-photo-wrapper">
          <v-avatar size="80" class="user-avatar">
            <v-img :src="avatarSrc" alt="Фото" @error="onAvatarError" />
          </v-avatar>
        </div>
        <div class="user-name-wrapper" v-if="showName">
          <div class="user-full-name">
            {{ userData.fullName || "Не указано" }}
          </div>
        </div>
      </div>

      <v-card-text class="user-info-content pa-3">
        <div class="info-row" v-if="showId">
          <i class="fas fa-id-card info-icon-fa" aria-hidden="true"></i>
          <span class="info-label">ID:</span>
          <span class="info-value">{{ userData.id || "—" }}</span>
        </div>

        <div class="info-row" v-if="showSid">
          <i class="fas fa-fingerprint info-icon-fa" aria-hidden="true"></i>
          <span class="info-label">SID:</span>
          <span class="info-value">{{ userData.sid || "—" }}</span>
        </div>

        <div class="info-row" v-if="userData.description && showDescription">
          <i class="fas fa-align-left info-icon-fa" aria-hidden="true"></i>
          <span class="info-label">Описание:</span>
          <span class="info-value description-text">{{
            userData.description
          }}</span>
        </div>

        <div class="info-row" v-if="showEmail">
          <i class="fas fa-envelope info-icon-fa" aria-hidden="true"></i>
          <span class="info-label">Email:</span>
          <a
            v-if="userData.email || userData.mail"
            :href="'mailto:' + (userData.email || userData.mail)"
            class="info-link"
          >
            {{ userData.email || userData.mail }}
          </a>
          <span v-else class="info-value">—</span>
        </div>

        <div class="info-row" v-if="showPhone">
          <i class="fas fa-phone info-icon-fa" aria-hidden="true"></i>
          <span class="info-label">Телефон:</span>
          <a
            v-if="userData.phone"
            :href="'tel:' + userData.phone"
            class="info-link"
          >
            {{ userData.phone }}
          </a>
          <span v-else class="info-value">—</span>
        </div>

        <div class="info-row" v-if="showSnils">
          <i class="fas fa-id-badge info-icon-fa" aria-hidden="true"></i>
          <span class="info-label">СНИЛС:</span>
          <span class="info-value">{{
            userData.snils || userData.SNILS || "—"
          }}</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    userData: Record<string, any>;
    showName?: boolean;
    showId?: boolean;
    showSid?: boolean;
    showDescription?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    showSnils?: boolean;
    showOpenProfile?: boolean;
  }>(),
  {
    showName: true,
    showId: true,
    showSid: true,
    showDescription: true,
    showEmail: true,
    showPhone: true,
    showSnils: true,
    showOpenProfile: false,
  },
);

const userData = computed(() => props.userData || {});
const fallbackAvatar = "/img/webapp/avatar.jpg";
const avatarError = ref(false);

const avatarSrc = computed(() => {
  const photo = String(userData.value.photo || "").trim();
  if (!photo || avatarError.value) return fallbackAvatar;
  return photo;
});

function onAvatarError() {
  if (avatarSrc.value !== fallbackAvatar) {
    avatarError.value = true;
  }
}

watch(
  () => userData.value.photo,
  () => {
    avatarError.value = false;
  },
);
</script>

<style scoped lang="scss">
.long-user-card-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.user-card {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  flex-shrink: 0;
  height: auto;
  background: transparent !important;
}

.user-header {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 100px;
  position: relative;
  background-color: rgba(100, 149, 237, 0.82);
}

.user-photo-wrapper {
  flex-shrink: 0;
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-name-wrapper {
  flex: 1;
  min-width: 0;
}

.user-full-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  word-break: break-word;
  line-height: 1.3;
}

.user-info-content {
  background: white;
  padding: 12px !important;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  .user-menu-fa {
    font-size: 24px !important;
  }
}

.info-row:last-child {
  border-bottom: none;
}

.info-icon {
  flex-shrink: 0;
  margin-top: 2px;
  width: 14px;
}

.info-icon-fa {
  flex-shrink: 0;
  margin-top: 2px;
  width: 14px;
  color: var(--ui-primary, #6495ed);
  font-size: 12px;
  text-align: center;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
  min-width: 70px;
}

.info-value {
  font-size: 13px;
  color: #333;
  word-break: break-word;
  line-height: 1.4;
  flex: 1;
}

.description-text {
  font-size: 12px;
  white-space: pre-wrap;
  line-height: 1.4;
}

.info-link {
  font-size: 13px;
  color: #1976d2;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.2s;
}

.info-link:hover {
  color: #1565c0;
  text-decoration: underline;
}
</style>
