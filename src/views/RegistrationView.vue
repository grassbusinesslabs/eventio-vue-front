<template>
   <auth-layout>
      <v-sheet class='mx-auto' width='320'>
         <v-form @submit.prevent='submit'>
            <v-row dense class="gap-4">
               <v-row justify="center" class="mb-4">
                  <v-col cols="12" class="text-center">
                     <h2 class="font-weight-bold">Реєстрація</h2>
                  </v-col>
               </v-row>
               <v-col cols='12'>
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
                     color='primary'
                  >
                     {{ translate('BTNS.REGISTER') }}
                  </v-btn>
               </v-col >
               <v-col cols="12" class="text-center">
                  <v-btn
                     :block='true'
                     text
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

import {useHandleError, useRouting} from '@/composables'
import {useAppI18n} from '@/i18n'
import {formService, requestService} from '@/services'
import AuthLayout from '@/layouts/AuthLayout.vue'

const request = requestService()

const {handleError} = useHandleError()
const {translate} = useAppI18n()
const routing = useRouting()
const {vuetifyConfig, emailValidator, passwordValidator, nameValidator} = formService()
//const request = requestService()

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

const showPassword = ref<boolean>(false)

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
      console.log('Реєстрація успішна')
      routing.toSignIn()

   } catch (e: any) {

   if (e.response) {
      alert('Помилка з боку сервера:' + JSON.stringify(e.response.data, null, 2))
   } else if (e.request) {
      alert('Запит надіслано, але відповіді не отримано:'+ e.request)
   } else {
      alert('Помилка під час налаштування запиту:' + e.message)
   }

   handleError(e)
   } finally {
      isSubmitting.value = false
   }
})

const navigateToLogin = () => {
   routing.toSignIn()
}
</script>

<style lang='scss' scoped>

</style>