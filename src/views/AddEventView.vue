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
            v-bind="eventTitleAttrs"
            placeholder="Введіть назву"
          />
        </div>

        <div class="form-group">
          <label>Опис заходу</label>
          <textarea
            v-model="description"
            v-bind="descriptionAttrs"
            placeholder="Введіть опис"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Дата та час проведення</label>
          <input
            type="datetime-local"
            v-model="eventDate"
            v-bind="eventDateAttrs"
            :min="minDateTime"
            :max="maxDateTime"
          />
        </div>

        <div class="form-group">
        <label>Місце проведення</label>
        <app-address-autocomplete @select="onAddressSelect" />
      </div>

      <div v-if="coordinates" class="form-group">
        <label>Координати обраного місця</label>
        <p>Широта: {{ coordinates.lat }}</p>
        <p>Довгота: {{ coordinates.lng }}</p>
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
        <div class="form-actions">
          <v-btn type="submit" class="save">Зберегти</v-btn>
          <v-btn text to="/myEvents">Скасувати</v-btn>
        </div>
      </form>
    </div>
  </auth-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";
import { mapService } from "@/services/map";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AppAddressAutocomplete from "@/components/AppAddressAutocomplete.vue";
import type { AddressItem } from "@/services/map";
import {formService, requestService} from '@/services'
import {useHandleError, useRouting} from '@/composables'


const { eventTitleValidator, descriptionValidator } = {
  eventTitleValidator: () => yup.string().required("Назва є обов'язковою"),
  descriptionValidator: () => yup.string().required("Опис є обов'язковим"),
};

const form = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      eventTitle: eventTitleValidator(),
      description: descriptionValidator(),
      eventDate: yup
        .date()
        .typeError("Дата та час є обов'язковими")
        .required("Оберіть дату та час заходу"),
    })
  ),
  initialValues: {
    eventTitle: "",
    description: "",
    eventDate: undefined,
  },
});

const [eventTitle, eventTitleAttrs] = form.defineField("eventTitle");
const [description, descriptionAttrs] = form.defineField("description");
const [eventDate, eventDateAttrs] = form.defineField("eventDate");

const request = requestService()
const routing = useRouting()

const dateTimeFormatter = (date: Date): string => {
  return date.toISOString();
};

const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
});
const maxDateTime = computed(() => {
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  nextYear.setMinutes(nextYear.getMinutes() - nextYear.getTimezoneOffset());
  return nextYear.toISOString().slice(0, 16);
});

const coordinates = ref<{ location: string; lat: number; lng: number } | null>(null);

const onAddressSelect = (address: AddressItem) => {
  if (address.details.position) {
    coordinates.value = {
      location: address.address,
      lat: address.details.position.lat as number,
      lng: address.details.position.lng as number
    };
  } else {
    console.error('No position data found for the selected address', address);
    coordinates.value = null;
  }
};

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

const submit = form.handleSubmit((values) => {

  try{
    const body: Record<string, any> = {
      title: values.eventTitle || '',
      description: values.description || '',
      date: values.eventDate ? Math.floor(values.eventDate.getTime() / 1000) : '',
      image: "image 221" ,//selectedFile.value || null,
      location: coordinates.value?.location || '',
      lat: coordinates.value?.lat ?? null,
      lon: coordinates.value?.lng ?? null
        }
         request.addEvent(body) 
      console.log('Івент успішно доданий')
      routing.toAllEvents()
        }
        catch (e: any) {

if (e.response) {
   alert('Помилка з боку сервера:' + JSON.stringify(e.response.data, null, 2))
} else if (e.request) {
   alert('Запит надіслано, але відповіді не отримано:'+ e.request)
} else {
   alert('Помилка під час налаштування запиту:' + e.message)
}
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
