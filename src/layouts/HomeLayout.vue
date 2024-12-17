<template>
   <v-layout class="rounded rounded-md">
      <app-header />

      <v-main class="bg-grey-lighten-3">
         <v-container>
            <v-row>
               <v-col cols="3" lg="2">
                  <v-card class="mx-auto" rounded="lg">
                     <!-- Заголовок з іменем -->
                     <template v-slot:title>
                        <span v-if="!isEditing" class="card-title">
                           {{ firstName }}<br />{{ secondName }}
                        </span>
                     </template>

                     <v-card-text>
                        <!-- Кнопка редагування -->
                        <v-btn
                           v-if="!isEditing"
                           class="mt-2"
                           :block="true"
                           type="button"
                           variant="text"
                           @click="toggleEditMode"
                        >
                           {{ translate('BTNS.EDIT') }}
                        </v-btn>

                        <!-- Форма редагування -->
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
                              class="mt-2"
                              :block="true"
                              type="submit"
                              color="primary"
                              :disabled="isSubmitting"
                           >
                              {{ translate('BTNS.SAVE') }}
                           </v-btn>
                        </v-form>

                        <!-- Кнопка виходу -->
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
               </v-col>

               <v-col>
                  <v-sheet min-height="70vh" rounded="lg">
                     <slot />
                  </v-sheet>
               </v-col>
            </v-row>
         </v-container>
      </v-main>
   </v-layout>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useHandleError, useRouting } from '@/composables'
import { useAppI18n } from '@/i18n'
import { formService, requestService } from '@/services'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'
import AppHeader from '@/components/AppHeader.vue'

const request = requestService()
const { handleError } = useHandleError()
const { translate } = useAppI18n()
const routing = useRouting()
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

      //await request.updateUser(currentUser.id, body) 

    if (currentUser.value) {
      currentUser.value.user.firstName = values.firstName || '';
   currentUser.value.user.secondName = values.secondName || '';
   currentUser.value.user.email = values.email || '';
   setCurrentUser(currentUser.value);
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
.card-title {
   font-size: 8;
}
</style>