<template>
  <profile-layout>
    <div class="content-section">
      <h2 class="text-h5 mb-6 text-center">
        {{ translate("TITLES.EDIT_PROFILE") }}
      </h2>
      <v-col cols="12" class="d-flex flex-column align-center">
                     <v-img
                        :src="getImageUrl"
                        :error-src="defaultImage"
                        alt="User Image"
                        class="card-image"
                        aspect-ratio="1"
                        cover
                     />
                     <div class="file-upload-wrapper d-flex flex-column align-center">
                        <v-btn
                           class="photo-button"
                           @click="triggerFileInput"
                           density="compact"
                           elevation="0"
                        >
                           змінити фото профілю
                        </v-btn>
                        <v-btn
                            class="photo-button"
                            color="error"
                            @click="deleteAvatar"
                            density="compact"
                            elevation="0"
                            variant="text"
                          >
                            видалити фото
                          </v-btn>
                        <input
                           ref="fileInput"
                           type="file"
                           accept="image/*"
                           @change="handleFileChange"
                           class="hidden-input"
                        />
                     </div>
                  </v-col>
      <v-form @submit.prevent="submit" class="form-container">
        <v-text-field
          v-model="firstName"
          v-bind="firstNameAttrs"
          :label="translate('INPUTS.FIRST_NAME')"
          variant="outlined"
          class="mb-4"
          :disabled="isSubmitting"
        />

        <v-text-field
          v-model="secondName"
          v-bind="secondNameAttrs"
          :label="translate('INPUTS.LAST_NAME')"
          variant="outlined"
          class="mb-4"
          :disabled="isSubmitting"
        />

        <v-text-field
          v-model="email"
          v-bind="emailAttrs"
          :label="translate('INPUTS.EMAIL')"
          variant="outlined"
          class="mb-4"
          :disabled="isSubmitting"
        />

        <v-btn
          class="ml-auto"
          size="large"
          type="submit"
          :loading="isSubmitting"
        >
          {{ translate('BTNS.SAVE') }}
        </v-btn>
      </v-form>

      <v-divider class="my-8"></v-divider>

      <v-btn
        color="error"
        variant="outlined"
        size="large"
        @click="showDeleteConfirm = true"
      >
        {{ translate('BTNS.DELETE') }}
      </v-btn>

      <v-dialog v-model="showDeleteConfirm" max-width="400">
        <v-card>
          <v-card-title class="text-center">
            {{ translate('DIALOGS.DELETE_ACCOUNT_TITLE') }}
          </v-card-title>
          <v-card-text>
            {{ translate('DIALOGS.DELETE_ACCOUNT_CONFIRM') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="showDeleteConfirm = false">
              {{ translate('BTNS.CANCEL') }}
            </v-btn>
            <v-btn
              color="error"
              @click="deleteAccount"
              :loading="isDeletingAccount"
            >
              {{ translate('BTNS.DELETE') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </profile-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import { formService, requestService } from '@/services'
import { useHandleError } from '@/composables'
import { useAppI18n } from '@/i18n'
import { useUserStore } from '@/stores'
import ProfileLayout from '@/layouts/ProfileLayout.vue'

const router = useRouter()
const request = requestService()
const { handleError } = useHandleError()
const { translate } = useAppI18n()
const { vuetifyConfig, emailValidator, nameValidator } = formService()

const userStore = useUserStore()
const { logout, setCurrentUser } = userStore
const { currentUser } = storeToRefs(userStore)
const isSubmitting = ref(false)
const isDeletingAccount = ref(false)
const showDeleteConfirm = ref(false)

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s"
const imageSrc = ref<string | null>(defaultImage) 

const form = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      firstName: nameValidator(),
      secondName: nameValidator(),
      email: emailValidator(),
    })
  ),
  initialValues: {
    firstName: currentUser.value?.firstName || '',
    secondName: currentUser.value?.secondName || '',
    email: currentUser.value?.email || '',
  },
})

const [firstName, firstNameAttrs] = form.defineField('firstName', vuetifyConfig)
const [secondName, secondNameAttrs] = form.defineField('secondName', vuetifyConfig)
const [email, emailAttrs] = form.defineField('email', vuetifyConfig)

const submit = form.handleSubmit(async (values) => {
  try {
    if (isSubmitting.value) return
    isSubmitting.value = true

    const body = {
      firstName: values.firstName || '',
      secondName: values.secondName || '',
      email: values.email || '',
    }

    await request.updateUser(body)
    if (selectedFile.value) {
      await request.updateUserImage(selectedFile.value)
    }

    if (currentUser.value) {
      currentUser.value = {
        ...currentUser.value,
        ...body
      }
      setCurrentUser(currentUser.value)
    }
  } catch (error) {
    handleError(error)
  } finally {
    isSubmitting.value = false
  }
})

const deleteAccount = async () => {
  try {
    isDeletingAccount.value = true
    await logout()
    router.push('/login')
  } catch (error) {
    handleError(error)
  } finally {
    isDeletingAccount.value = false
    showDeleteConfirm.value = false
  }
}
const getImageUrl = computed(() => {
  return currentUser.value?.id
    ? `https://eventio.grassbusinesslabs.uk/static/user_image/${currentUser.value.id}.png`
    : defaultImage
})
const triggerFileInput = () => {
  fileInput.value?.click() 
}
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const file = files[0]

    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, виберіть лише зображення.')
      target.value = ''
      return
    }

    selectedFile.value = file

    try {
      const imageExists = await checkImageExists(currentUser.value?.id)
      
      if (imageExists) {
        await request.updateUserImage(file)
      } else {
        await request.uploadUserImage(file)
      }
      const timestamp = Date.now()
      imageSrc.value = `${getImageUrl.value}?t=${timestamp}`
    } catch (error) {
      handleError(error)
    }
  }
}

const checkImageExists = async (userId: string | number | undefined): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const response = await fetch(`https://eventio.grassbusinesslabs.uk/static/user_image/${userId}.png`);
    return response.status === 200;
  } catch {
    return false;
  }
}

const deleteAvatar = async () => {
  try {
    await request.deleteUserImage() 
    const timestamp = Date.now()
    imageSrc.value = `https://eventio.grassbusinesslabs.uk/static/user_image/${currentUser.value?.id}.png?t=${timestamp}`
  } catch (error) {
    handleError(error)
  }
}
</script>

<style lang="scss" scoped>
.content-section {
  max-width: 670px;
  margin: 0 auto;
  padding: 24px;
}
.card-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 50%;
  align-self: center;
  overflow: hidden;
  margin-bottom: 8px; 
}

.hidden-input {
  display: none;
}

.file-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-button {
  font-size: small;
  margin-top: 8px; 
}
</style>