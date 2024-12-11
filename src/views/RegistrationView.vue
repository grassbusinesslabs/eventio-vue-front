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
                     v-model='lastName'
                     v-bind='lastNameAttrs'
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
                     v-model='username'
                     v-bind='usernameAttrs'
                     :label='translate("INPUTS.USERNAME")'
                     :disabled='isSubmitting'
                     :hide-details='true'
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
               <v-col cols='12'  class="mb-4">
                  <v-btn-toggle
                        v-model="gender"
                        v-bind='genderAttrs'
                        mandatory
                        >
                        <v-btn value="male">
                        <v-icon left>mdi-gender-male</v-icon> {{translate('INPUTS.MALE')}}
                        </v-btn>
                        <v-btn value="female">
                        <v-icon left>mdi-gender-female</v-icon> {{translate('INPUTS.FEMALE')}}
                        </v-btn>
                        <v-btn value="other"> {{translate('INPUTS.OTHER')}}
                        </v-btn>
                     </v-btn-toggle>
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

const {handleError} = useHandleError()
const {translate} = useAppI18n()
const routing = useRouting()
const {vuetifyConfig, usernameValidator, emailValidator, passwordValidator, nameValidator} = formService()
//const request = requestService()

const form = useForm({
   validationSchema: toTypedSchema(
      yup.object({
         username: usernameValidator(),
         email: emailValidator(),
         firstName: nameValidator(),
         lastName: nameValidator(),
         gender: yup.string().required(),
         password: passwordValidator()
      })
   ),
   initialValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      gender: '',
      password: ''
   }
})

const isSubmitting = ref<boolean>(false)
const [username, usernameAttrs] = form.defineField('username' as MaybeRefOrGetter, vuetifyConfig)
const [email, emailAttrs] = form.defineField('email' as MaybeRefOrGetter, vuetifyConfig)
const [firstName, firstNameAttrs] = form.defineField('firstName' as MaybeRefOrGetter, vuetifyConfig)
const [lastName, lastNameAttrs] = form.defineField('lastName' as MaybeRefOrGetter, vuetifyConfig)
const [gender, genderAttrs] = form.defineField('gender' as MaybeRefOrGetter, vuetifyConfig)
const [password, passwordAttrs] = form.defineField('password' as MaybeRefOrGetter, vuetifyConfig)

const showPassword = ref<boolean>(false)

const submit = form.handleSubmit(async values => {
   try {
      if (isSubmitting.value) {
         return
      }
      isSubmitting.value = true

      const body = {
         username: values.username,
         email: values.email,
         firstName: values.firstName,
         lastName: values.lastName,
         gender: values.gender,
         password: values.password
      }

      //await request.register(body)
      routing.toSignIn()

      isSubmitting.value = false
   } catch (e) {
      console.error(e)
      handleError(e)
      isSubmitting.value = false
   }
})
const navigateToLogin = () => {
   routing.toSignIn()
}
</script>

<style lang='scss' scoped>

</style>