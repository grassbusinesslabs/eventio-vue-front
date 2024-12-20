<template>
  <v-app-bar color="#753737FF" dark class="app-bar">
    <v-app-bar-title>Event Management</v-app-bar-title>
    <v-icon left>mdi-map-marker</v-icon>
    <app-select-city/>
    <v-spacer />
    
    <template v-slot:append>
      <app-select-lang />

      <v-menu
        v-model="showProfileMenu"
        :close-on-content-click="false"
        location="bottom end"
        offset="10"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="account-button ml-4"
            variant="outlined"
            style="border-color: #ccc;"
          >
            <v-icon style="font-size: 55px;" class="account-icon">
              mdi-account-circle
            </v-icon>
          </v-btn>
        </template>

        <v-card min-width="250" class="mt-2">
          <template v-slot:title>
            <span v-if="!isEditing" class="card-title">
              {{ firstName }} {{ secondName }}
            </span>
          </template>
          
          <v-divider></v-divider>
          
          <v-card-text>
            <v-btn class="mt-2" text to="/profile"
            variant="text" :block="true">Особистий кабінет</v-btn>
            <v-form v-if="isEditing" @submit.prevent="submit">
              <v-text-field
                v-model="firstName"
                v-bind="firstNameAttrs"
                :label="translate('INPUTS.FIRST_NAME')"
                outlined
                :disabled="isSubmitting"
              />
              <v-text-field
                v-model="secondName"
                v-bind="secondNameAttrs"
                :label="translate('INPUTS.LAST_NAME')"
                outlined
                :disabled="isSubmitting"
              />
              <v-text-field
                v-model="email"
                v-bind="emailAttrs"
                :label="translate('INPUTS.EMAIL')"
                outlined
                :disabled="isSubmitting"
              />
              <v-btn
                class="bml-auto"
                elevation="4"
                :block="true"
                type="submit"
                :disabled="isSubmitting"
              >
                {{ translate('BTNS.SAVE') }}
              </v-btn>
            </v-form>

            <v-btn
              v-if="!isEditing"
              class="mt-2"
              :block="true"
              type="button"
              variant="text"
              @click="logout"
            >
              {{ translate('BTNS.LOGOUT') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AppSelectLang from "@/components/AppSelectLang.vue"
import AppSelectCity from "@/components/AppSelectCity.vue"
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useHandleError } from '@/composables'
import { useAppI18n } from '@/i18n'
import { formService, requestService } from '@/services'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'

const showProfileMenu = ref(false)
const request = requestService()
const { handleError } = useHandleError()
const { translate } = useAppI18n()
const { vuetifyConfig, emailValidator, nameValidator } = formService()

const userStore = useUserStore()
const { logout, setCurrentUser } = userStore
const { currentUser } = storeToRefs(userStore)

const isEditing = ref(false)
const isSubmitting = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(
     yup.object({
        firstName: nameValidator(),
        secondName: nameValidator(),
        email: emailValidator(),
     })
  ),
  initialValues: {
     firstName: currentUser.value?.user.firstName || '',
     secondName: currentUser.value?.user.secondName || '',
     email: currentUser.value?.user.email || '',
  },
})

const [firstName, firstNameAttrs] = form.defineField('firstName', vuetifyConfig)
const [secondName, secondNameAttrs] = form.defineField('secondName', vuetifyConfig)
const [email, emailAttrs] = form.defineField('email', vuetifyConfig)

function toggleEditMode() {
  isEditing.value = !isEditing.value
}

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
        currentUser.value.user.firstName = values.firstName || ''
        currentUser.value.user.secondName = values.secondName || ''
        currentUser.value.user.email = values.email || ''
        setCurrentUser(currentUser.value)
     }

     toggleEditMode()
  } catch (error) {
     handleError(error)
  } finally {
     isSubmitting.value = false
  }
})
</script>

<style lang="scss" scoped>
.app-bar{
  border-radius: 0%;
}
.account-button {
 border-radius: 50%;
 height: 60px;
 width: 60px;
 align-content: center;
 padding: 0;
 border: 0px;
}

.card-title {
 font-size: 8;
}

.card-email {
 font-size: 3;
}
</style>