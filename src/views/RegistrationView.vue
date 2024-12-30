<template>
   <auth-layout>
      <v-sheet class='mx-auto' width='320'>
         <v-snackbar
            v-model="showError"
            color="error"
            timeout="5000"
         >
            {{ errorMessage }}
         </v-snackbar>
         <v-form @submit.prevent='submit'>
            <v-row dense class="gap-4">
               <v-row justify="center" class="mb-4">
                  <v-col cols="12" class="text-center">
                     <h2 class="font-weight-bold">Реєстрація</h2>
                  </v-col>
               </v-row>
               <v-col cols='12'>
                  <v-col cols="12" class="d-flex flex-column align-center">
                     <v-img
                        :src="imageSrc || defaultImage"
                        error-src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
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
                        <input
                           ref="fileInput"
                           type="file"
                           accept="image/*"
                           @change="handleFileChange"
                           class="hidden-input"
                        />
                     </div>
                  </v-col>
                  <v-text-field
                     v-model='firstName'
                     v-bind='firstNameAttrs'
                     :label='translate("INPUTS.FIRST_NAME")'
                     :disabled='isSubmitting'
                     :hide-details='true'
                  ></v-text-field>
               </v-col>

               <v-col cols='12' class="mb-4">
                  <v-text-field
                     v-model='secondName'
                     v-bind='secondNameAttrs'
                     :label='translate("INPUTS.LAST_NAME")'
                     :disabled='isSubmitting'
                     :hide-details='true'
                  ></v-text-field>
               </v-col>
               <v-col cols='12' class="mb-4">
                  <v-text-field
                     v-model='email'
                     v-bind='emailAttrs'
                     :label='translate("INPUTS.EMAIL")'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     type='email'
                  ></v-text-field>
               </v-col>            
              
               <v-col cols='12'>
                  <v-text-field
                     v-model='password'
                     v-bind='passwordAttrs'
                     :label='translate("INPUTS.PASSWORD")'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                     :type="showPassword ? 'text' : 'password'"
                     @click:append-inner='showPassword = !showPassword'
                  ></v-text-field>
               </v-col>
               

               <v-col cols='12'>
                  <v-btn
                     class='mt-2'
                     :block='true'
                     :disabled='isSubmitting'
                     type='submit'
                     color="#753737FF"
                  >
                     {{ translate('BTNS.REGISTER') }}
                  </v-btn>
               </v-col >
               <v-col cols="12" class="text-center">
                  <v-btn
                     :block='true'
                   
                     color="#d8dce3"
                     @click="navigateToLogin"
                  >
                     {{ translate('BTNS.SIGN_IN') }}
                  </v-btn>
               </v-col>
            </v-row>
         </v-form>
      </v-sheet>
   </auth-layout>
</template>

<script lang='ts' setup>
import {useForm} from 'vee-validate'
import {toTypedSchema} from '@vee-validate/yup'
import * as yup from 'yup'
import type {MaybeRefOrGetter} from 'vue'
import {ref} from 'vue'

import { useRouting} from '@/composables'
import {useAppI18n} from '@/i18n'
import {formService, requestService} from '@/services'
import AuthLayout from '@/layouts/AuthLayout.vue'

const request = requestService()

const {translate} = useAppI18n()
const routing = useRouting()
const {vuetifyConfig, emailValidator, passwordValidator, nameValidator} = formService()
//const request = requestService()
const defaultImage = "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"

const form = useForm({
   validationSchema: toTypedSchema(
      yup.object({
         email: emailValidator(),
         firstName: nameValidator(),
         secondName: nameValidator(),
         password: passwordValidator()
      })
   ),
   initialValues: {
      email: '',
      firstName: '',
      secondName: '',
      password: ''
   }
})

const isSubmitting = ref<boolean>(false)
const [email, emailAttrs] = form.defineField('email' as MaybeRefOrGetter, vuetifyConfig)
const [firstName, firstNameAttrs] = form.defineField('firstName' as MaybeRefOrGetter, vuetifyConfig)
const [secondName, secondNameAttrs] = form.defineField('secondName' as MaybeRefOrGetter, vuetifyConfig)
const [password, passwordAttrs] = form.defineField('password' as MaybeRefOrGetter, vuetifyConfig)
const selectedFile = ref<File | null>(null)
const imageSrc = ref<string | null>(defaultImage) 
const showPassword = ref<boolean>(false)
const fileInput = ref<HTMLInputElement | null>(null)
   const showError = ref(false)
   const errorMessage = ref('')

const submit = form.handleSubmit(async values => {
   try {
      if (isSubmitting.value) return
      isSubmitting.value = true

      const body: Record<string, string> = {
         email: values.email || '', 
         password: values.password || '',
         firstName: values.firstName || '',
         secondName: values.secondName || ''
         
      }

      await request.register(body) 
      if (selectedFile.value) {
      await request.uploadUserImage(selectedFile.value)
    }
      console.log('Реєстрація успішна')
      routing.toSignIn()

   } catch (e) {

      errorMessage.value = "Користувач з такою поштою вже існує"
      showError.value = true
      console.error(e)
      isSubmitting.value = false
   //handleError(e)
   } finally {
      isSubmitting.value = false
   }
})

const navigateToLogin = () => {
   routing.toSignIn()
}
const triggerFileInput = () => {
  fileInput.value?.click() 
}

const handleFileChange = (event: Event) => {
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

    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string || null 
    }
    reader.readAsDataURL(file)
  } else {
    imageSrc.value = defaultImage
  }
}
</script>

<style lang='scss' scoped>
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