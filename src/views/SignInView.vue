<template>
   <auth-layout>
      <v-sheet class='mx-auto' width='320'>
         <v-form @submit.prevent='submit'>
            <v-row dense class="gap-4">
               <v-row justify="center" class="mb-4">
                  <v-col cols="12" class="text-center">
                     <h2 class="font-weight-bold">Увійти</h2>
                  </v-col>
               </v-row>

               <v-col cols='12'>
                  <v-text-field
                     v-model='email'
                     v-bind='emailAttrs'
                     :label='translate("INPUTS.EMAIL")'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     type='email'
                  ></v-text-field>
               </v-col>

               <v-col cols='12' class="mb-4">
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
                     {{ translate('BTNS.SIGN_IN') }}
                  </v-btn>
               </v-col >
               <v-col cols="12" class="text-center">
                  <v-btn
                     :block='true'
                     text
                     color="#d8dce3"
                     @click="navigateToRegistration"
                  >
                     {{ translate('BTNS.REGISTER') }}
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

import type {CurrentUser, LoginBody} from '@/models'
import {useHandleError, useRouting} from '@/composables'
import {useAppI18n} from '@/i18n'
import {authTokenService, formService, requestService} from '@/services'
import {useUserStore} from '@/stores'
import AuthLayout from '@/layouts/AuthLayout.vue'

const {handleError} = useHandleError()
const {translate} = useAppI18n()
const routing = useRouting()
const userStore = useUserStore()
const {setCurrentUser} = userStore

const {vuetifyConfig, emailValidator, passwordValidator} = formService()
const request = requestService()
const authToken = authTokenService()

const form = useForm({
   validationSchema: toTypedSchema(
      yup.object({
         email: emailValidator(),
         password: passwordValidator()
      })
   ),
   initialValues: {
      email: '',
      password: ''
   }
})

const isSubmitting = ref<boolean>(false)
const [email, emailAttrs] = form.defineField('email' as MaybeRefOrGetter, vuetifyConfig)
const [password, passwordAttrs] = form.defineField('password' as MaybeRefOrGetter, vuetifyConfig)

const showPassword = ref<boolean>(false)

const submit = form.handleSubmit(async values => {
   try {
      if (isSubmitting.value) {
         return
      }
      isSubmitting.value = true

      const body: LoginBody = {
         email: values.email|| '',
         password: values.password|| ''
      }
      const currentUser: CurrentUser = await request.login(body)
      setCurrentUser(currentUser)
      await authToken.set(currentUser.token)
       routing.toAllEvents()

      isSubmitting.value = false
   } catch (e) {
      alert('Помилка обробляється')
      console.error(e)
      handleError(e)
      isSubmitting.value = false
   }
})
const navigateToRegistration = () => {
   routing.toRegistration()
}
</script>

<style lang='scss' scoped>

</style>
