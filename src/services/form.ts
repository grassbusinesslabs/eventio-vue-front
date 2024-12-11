import * as yup from 'yup'

import {
   MAX_PASS_LEN,
   MAX_TEXT_LEN,
   MAX_TITLE_LEN,
   MAX_USERNAME_LEN,
   MIN_PASS_LEN,
   MIN_TEXT_LEN,
   MIN_TITLE_LEN,
   MIN_USERNAME_LEN,
   MAX_DESCRIPTION_LEN,
   MIN_LOCATION_LEN,
   MAX_LOCATION_LEN
} from '@/constants'

export const formService = () => {
   function vuetifyConfig(state: any) {
      return {
         props: {
            'error-messages': state.errors
         }
      }
   }

   function usernameValidator(required: boolean = true) {
      const validator = yup.string().min(MIN_USERNAME_LEN).max(MAX_USERNAME_LEN)
      return required ? validator.required() : validator
   }

   function passwordValidator(required: boolean = true) {
      const validator = yup.string().min(MIN_PASS_LEN).max(MAX_PASS_LEN).required()
      return required ? validator.required() : validator
   }

   function textValidator(required: boolean = true) {
      const validator = yup.string().min(MIN_TEXT_LEN).max(MAX_TEXT_LEN)
      return required ? validator.required() : validator
   }
   function emailValidator(required: boolean = true) {
      const validator = yup.string().email('Invalid email address')
      return required ? validator.required('Email is required') : validator
   }
   function eventTitleValidator(required: boolean = true) {
      const validator = yup.string().min(MIN_TITLE_LEN).max(MAX_TITLE_LEN);
      return required ? validator.required('Назва заходу є обовʼязковою') : validator;
   }
   
   function descriptionValidator(required: boolean = false) {
      const validator = yup.string().max(MAX_DESCRIPTION_LEN);
      return required ? validator.required('Опис є обовʼязковим') : validator;
   }
   
   function eventDateValidator(required: boolean = true) {
      const validator = yup
         .date()
         .min(new Date(), 'Дата не може бути в минулому')
         .max(
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            'Дата не може бути більше ніж через рік'
         );
      return required ? validator.required('Дата є обовʼязковою') : validator;
   }
   
   function locationValidator(required: boolean = true) {
      const validator = yup.string().min(MIN_LOCATION_LEN).max(MAX_LOCATION_LEN);
      return required ? validator.required('Місце проведення є обовʼязковим') : validator;
   }
   function nameValidator(required: boolean = true) {
      const validator = yup
         .string()
         .min(2, 'Name must be at least 2 characters long')
         .max(30, 'Name must not exceed 30 characters')
         .matches(/^[a-zA-Zа-яА-Я\s]+$/, 'Name can only contain letters and spaces')
   
      return required ? validator.required('Name is required') : validator
   }
   return {
      vuetifyConfig,
      usernameValidator,
      passwordValidator,
      eventTitleValidator,
      textValidator,
      emailValidator,
      nameValidator,
      descriptionValidator,
      locationValidator,
      eventDateValidator
   }
}
