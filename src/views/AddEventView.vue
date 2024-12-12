<template>
    <auth-layout>
    <div class="container">
      <h1>Створення заходу</h1>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>Назва заходу</label>
          <input
            type="text"
            v-model="eventTitle"
            v-bind='eventTitleAttrs'
            placeholder="Введіть назву"
          />
        </div>
        <div class="form-group">
          <label>Опис заходу</label>
          <textarea
            v-model="description"
            v-bind='descriptionAttrs'
            placeholder="Введіть опис"
          ></textarea>
        </div>
        <div class="form-group">
          <label>Дата проведення</label>
          <input
            type="date"
            v-model="eventDate"
            v-bind='eventDateAttrs'
            :max="maxDate"  
            :min="minDate" 
            @update:model-value="selectDate" 
          />
        </div>
        <div class="form-group">
          <label>Завантажити файл</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            ref="fileInput"
          />
        </div>
        <div class="form-group">
          <label>Місце проведення</label>
          <input
            type="text"
            v-model="location"
            v-bind='locationAttrs'
            placeholder="Введіть адресу"
          />
          </div>
        <div class="form-actions">
          <v-btn type="submit" class="save">Зберегти</v-btn>
          <v-btn class="mr-4" text to="/myEvents">
            Скасувати
          </v-btn>
        </div>
      </form>
    </div>
</auth-layout>
  </template>
  
  <script lang='ts' setup>  
import {useForm} from 'vee-validate'  
import {toTypedSchema} from '@vee-validate/yup'  
import * as yup from 'yup'  
import type {MaybeRefOrGetter} from 'vue'  
import {ref, computed} from 'vue'  

import {useHandleError, useRouting} from '@/composables'  
import {useAppI18n} from '@/i18n'  
import {formService, requestService} from '@/services'
import AuthLayout from '@/layouts/AuthLayout.vue' 

const {handleError} = useHandleError()  
const {translate} = useAppI18n()  
const routing = useRouting()  
const {vuetifyConfig, eventTitleValidator, descriptionValidator, locationValidator} = formService()  

const form = useForm({  
    validationSchema: toTypedSchema(  
       yup.object({  
        eventTitle: eventTitleValidator(),
        description: descriptionValidator(),
        location: locationValidator(),
        eventDate: yup.date().required('Оберіть дату заходу')  
       })  
    ),  
    initialValues: {  
        eventTitle:'',
        description: '',
        location: '',  
        eventDate: undefined 
    }  
})  

const isSubmitting = ref<boolean>(false)  
const showDatePicker = ref<boolean>(false)  
const [eventTitle, eventTitleAttrs] = form.defineField('eventTitle' as MaybeRefOrGetter, vuetifyConfig)  
const [description, descriptionAttrs] = form.defineField('description' as MaybeRefOrGetter, vuetifyConfig)  
const [eventDate, eventDateAttrs] = form.defineField('eventDate' as MaybeRefOrGetter, vuetifyConfig)
const [location, locationAttrs] = form.defineField('location' as MaybeRefOrGetter, vuetifyConfig)    

const minDate = computed(() => new Date().toISOString().split('T')[0])  
const maxDate = computed(() => {  
    const nextYear = new Date()  
    nextYear.setFullYear(nextYear.getFullYear() + 1)  
    return nextYear.toISOString().split('T')[0]  
})  

/*
const formattedEventDate = computed(() => {  
    if (!eventDate.value) return ''  
    return new Date(eventDate.value).toLocaleDateString('uk-UA')  
})  */

const selectDate = (date: string) => {  
    eventDate.value = date  
    showDatePicker.value = false  
}  

const selectedFile = ref<File | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0];

  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, виберіть лише зображення.');
      target.value = '';
      return;
    }

    selectedFile.value = file;
  }
};

const submit = form.handleSubmit(async values => {  
    try {  
       if (isSubmitting.value) {  
          return  
       }  
       isSubmitting.value = true  

       const body = {  
        eventTitle: values.eventTitle,
        description: values.description,
        eventDate: values.eventDate,
        location: values.location,
        image: selectedFile.value
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
 
</script>
  
  <style lang="scss" scoped>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 800px;
    width: 100%;
  }
  .container h1 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align:left;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  .form-group textarea {
    resize: none;
    height: 80px;
  }
  .form-actions {
    display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  }
  .form-actions button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    align-items: center;
  }
  .form-actions .save {
    background-color: #007bff;
    color: #fff;
  }
  .form-actions .save:hover {
    background-color: #0056b3;
  }
  .form-actions .cancel {
    background-color: #ccc;
    color: #333;
  }
  .form-actions .cancel:hover {
    background-color: #999;
  }
  </style>
  