<template>
  <profile-layout>
    <div class="content-section">
      <h2 class="text-h5 mb-6 text-center">
        {{ translate("TITLES.EDIT_PROFILE") }}
      </h2>

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
import { ref } from 'vue'
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
</script>

<style lang="scss" scoped>
.content-section {
  max-width: 670px;
  margin: 0 auto;
  padding: 24px;
}
</style>