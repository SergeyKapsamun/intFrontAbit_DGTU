<template>
	<div style="display: flex; flex-direction: column; align-items: start">
		
		<div v-if="loading">Загрузка...</div>

		
		<div v-if="error">{{ error }}</div>

		
		<img
			v-if="fileUrl"
			:src="fileUrl"
			alt="Файл"
			style="max-width: 20%; height: auto"
		/>

		
		<a
			v-if="downloadUrl"
			:href="downloadUrl"
			:download="fileName"
			class="download-link"
		>
			Скачать файл
		</a>
	</div>
</template>
<script setup lang="ts">

import axios from 'axios'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getAuthToken, refreshAuthToken } from '@/shared/api/authSession'

const props = defineProps({
	document: { type: Object },
	apiUrl: {
		type: String,
		default: null,
	},
})

const resolvedApiUrl = computed(() => props.apiUrl || null)
const fileUrl = ref<string | null>(null)
const downloadUrl = ref<string | null>(null)
const fileName = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function cleanupUrls() {
	if (fileUrl.value) {
		URL.revokeObjectURL(fileUrl.value)
	}
	if (downloadUrl.value) {
		URL.revokeObjectURL(downloadUrl.value)
	}
}

function hexToBytes(hex: string) {
	const bytes = new Uint8Array(hex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
	}
	return bytes
}

function isValidHexString(str: unknown) {
	if (typeof str !== 'string') return false
	return str.length % 2 === 0 && /^[0-9A-Fa-f]*$/.test(str)
}

function containsStringInBytes(bytes: Uint8Array, searchString: string) {
	const searchBytes = new TextEncoder().encode(searchString)
	for (let i = 0; i <= bytes.length - searchBytes.length; i++) {
		let found = true
		for (let j = 0; j < searchBytes.length; j++) {
			if (bytes[i + j] !== searchBytes[j]) {
				found = false
				break
			}
		}
		if (found) return true
	}
	return false
}

function detectMimeType(bytes: Uint8Array) {
	if (
		bytes[0] === 0x89 &&
		bytes[1] === 0x50 &&
		bytes[2] === 0x4e &&
		bytes[3] === 0x47
	) {
		return { mime: 'image/png', ext: '.png' }
	}
	if (
		(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
		(bytes[6] === 0x4a &&
			bytes[7] === 0x46 &&
			bytes[8] === 0x49 &&
			bytes[9] === 0x46) ||
		(bytes[6] === 0x45 &&
			bytes[7] === 0x78 &&
			bytes[8] === 0x69 &&
			bytes[9] === 0x66)
	) {
		return { mime: 'image/jpeg', ext: '.jpg' }
	}
	if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
		return { mime: 'image/gif', ext: '.gif' }
	}
	if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
		return { mime: 'image/bmp', ext: '.bmp' }
	}
	if (
		bytes[0] === 0x25 &&
		bytes[1] === 0x50 &&
		bytes[2] === 0x44 &&
		bytes[3] === 0x46
	) {
		return { mime: 'application/pdf', ext: '.pdf' }
	}
	if (
		bytes[0] === 0x50 &&
		bytes[1] === 0x4b &&
		(bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
		(bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08) &&
		containsStringInBytes(bytes, 'word/')
	) {
		return {
			mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			ext: '.docx',
		}
	}
	if (
		bytes[0] === 0xd0 &&
		bytes[1] === 0xcf &&
		bytes[2] === 0x11 &&
		bytes[3] === 0xe0 &&
		bytes[4] === 0xa1 &&
		bytes[5] === 0xb1 &&
		bytes[6] === 0x1a &&
		bytes[7] === 0xe1
	) {
		return { mime: 'application/msword', ext: '.doc' }
	}
	if (
		bytes[0] === 0x50 &&
		bytes[1] === 0x4b &&
		(bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
		(bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
	) {
		if (containsStringInBytes(bytes, 'xl/')) {
			return {
				mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				ext: '.xlsx',
			}
		}
		if (containsStringInBytes(bytes, 'ppt/')) {
			return {
				mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
				ext: '.pptx',
			}
		}
		if (containsStringInBytes(bytes, 'word/')) {
			return {
				mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				ext: '.docx',
			}
		}
		return { mime: 'application/zip', ext: '.zip' }
	}
	if (
		containsStringInBytes(bytes, 'SIGNATURE') ||
		containsStringInBytes(bytes, 'signature') ||
		(bytes.length > 10 && bytes.every(b => b >= 32 && b <= 126))
	) {
		return { mime: 'application/octet-stream', ext: '.sig' }
	}
	return { mime: 'application/octet-stream', ext: '.bin' }
}

function createAuthorizedHeaders(token: string) {
	return {
		Accept: 'application/json',
		Authorization: `Bearer ${token}`,
	}
}

function isUnauthorizedError(error: unknown) {
	return axios.isAxiosError(error) && error.response?.status === 401
}

async function requestFileContent(url: string, token: string) {
	const response = await axios.get(url, {
		responseType: 'json',
		headers: createAuthorizedHeaders(token),
	})

	return response?.data ?? null
}

async function fetchAndRender() {
	cleanupUrls()
	loading.value = true
	error.value = null
	fileUrl.value = null
	downloadUrl.value = null
	fileName.value = null

	try {
		if (!resolvedApiUrl.value) {
			throw new Error('URL файла не передан')
		}

		const token = getAuthToken()
		if (!token) {
			throw new Error('Токен доступа не найден')
		}

		let response = null

		try {
			response = await requestFileContent(resolvedApiUrl.value, token)
		} catch (err) {
			if (!isUnauthorizedError(err)) {
				throw err
			}

			const refreshedToken = await refreshAuthToken()
			if (!refreshedToken) {
				throw err
			}

			response = await requestFileContent(resolvedApiUrl.value, refreshedToken)
		}

		const fileContent = response?.fileContent
		if (isValidHexString(fileContent)) {
			const byteData = hexToBytes(fileContent)
			const { mime } = detectMimeType(byteData)
			const blob = new Blob([byteData], { type: mime })
			const objectUrl = URL.createObjectURL(blob)

			if (mime.startsWith('image/')) {
				fileUrl.value = objectUrl
				downloadUrl.value = objectUrl
				fileName.value = props.document?.fileName || 'document'
			} else {
				downloadUrl.value = objectUrl
				fileName.value = props.document?.fileName || 'document'
			}
		} else {
			fileUrl.value = fileContent
		}
	} catch (err) {
		error.value = err?.message || 'Произошла ошибка при загрузке файла'
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	void fetchAndRender()
})

watch(
	() => [props.document?.id, resolvedApiUrl.value],
	() => {
		void fetchAndRender()
	},
)

onBeforeUnmount(() => {
	cleanupUrls()
})
</script>

<style scoped>
.download-link {
	display: inline-block;
	padding: 10px 15px;
	background-color: #2196f3;
	color: white;
	text-decoration: none;
	border-radius: 4px;
	margin-top: 10px;
}

.download-link:hover {
	background-color: #1976d2;
}
</style>
