<template>
  <auth-layout>
    <div class="container">
      <h1>{{ isEditMode ? translate('TEXT.EDIT_EVENT') : translate('TEXT.CREATE_EVENT') }}</h1>
      <v-snackbar
        v-model="showError"
        color="error"
        timeout="5000"
        location="top"
      >
        {{ errorMessage }}
        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="showError = false"
          >
            {{ translate('TEXT.CLOSE') }}
          </v-btn>
        </template>
      </v-snackbar>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>{{ translate('TEXT.EVENT_TITLE') }}</label>
          <input
            type="text"
            v-model="eventTitle"
            v-bind="eventTitleAttrs"
            :placeholder="translate('TEXT.ENTER_TITLE')"
          />
        </div>

        <div class="form-group">
          <label>{{ translate('TEXT.EVENT_DESCRIPTION') }}</label>
          <textarea
            v-model="description"
            v-bind="descriptionAttrs"
            :placeholder="translate('TEXT.ENTER_DESCRIPTION')"
            height="200px"
          ></textarea>
        </div>

        <div class="form-group">
          <label>{{ translate('TEXT.EVENT_DATE_TIME') }}</label>
          <VueDatePicker 
              height="200px"
              v-model="eventDate"
              v-bind="eventDateAttrs"
              :min-date="minDateTime"
              :max-date="maxDateTime">
          </VueDatePicker>
        </div>
        <div class="form-group">
          <label>{{ translate('TEXT.EVENT_LOCATION') }}</label>
          <label font-weight="light">{{ translate('TEXT.CURRENT_LOCATION') }}: {{ coordinates?.location }}</label>
          <app-address-autocomplete 
            @select="onAddressSelect"
            :initial-value="coordinates?.location"
          />
        </div>

        <div v-if="coordinates" class="form-group">
          <label>{{ translate('TEXT.SELECTED_COORDINATES') }}</label>
          <p>{{ translate('TEXT.LATITUDE') }}: {{ coordinates.lat }}</p>
          <p>{{ translate('TEXT.LONGITUDE') }}: {{ coordinates.lng }}</p>
        </div>

        <div class="form-group">
          <label>{{ translate('TEXT.UPLOAD_FILE') }}</label>
          <div class="image-upload-container">
            <v-file-input
              type="file"
              accept="image/*"
              @change="handleFileChange"
            />
            <div v-if="imageSrc" class="preview-image">
              <img :src="imageSrc" alt="{{ translate('TEXT.PREVIEW_IMAGE') }}" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <v-btn type="submit" class="save">{{ isEditMode ? translate('TEXT.UPDATE') : translate('TEXT.SAVE') }}</v-btn>
          <v-btn to="/myEvents" @click="cancel">{{ translate('TEXT.CANCEL') }}</v-btn>
        </div>
      </form>
    </div>
  </auth-layout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/yup"
import * as yup from "yup"
import AuthLayout from "@/layouts/AuthLayout.vue"
import AppAddressAutocomplete from "@/components/AppAddressAutocomplete.vue"
import type { AddressItem } from "@/services/map"
import { requestService } from '@/services'
import { useRouting } from '@/composables'
import type { Event } from "@/models"
import { useAppI18n } from "@/i18n"

const eventId = localStorage.getItem('eventId')
const isEditMode = computed(() => Boolean(eventId))
const { translate } = useAppI18n()

console.log('Found event with coordinates:', eventId)

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
    eventDate: new Date(),
  },
});

const [eventTitle, eventTitleAttrs] = form.defineField("eventTitle")
const [description, descriptionAttrs] = form.defineField("description")
const [eventDate, eventDateAttrs] = form.defineField("eventDate")

const request = requestService()
const routing = useRouting()

const showError = ref(false)
const errorMessage = ref('')

const page = localStorage.getItem('currentMyPage') || '1'

interface Coordinates {
  location: string
  lat: number
  lng: number
}

const coordinates = ref<Coordinates | null>(null)
const selectedFile = ref<File | null>(null)
const imageSrc = ref<string | null>(null)
  const eventDateString = ref<string | null>(null)

  const loadEventData = async () => {
  console.log('Starting loadEventData')
  console.log('isEditMode:', isEditMode.value)
  console.log('eventId:', eventId)

  if (!isEditMode.value) {
    console.log('Not in edit mode, returning')
    return
  }
  
  const currentEventId = eventId
  if (!currentEventId) {
    console.log('No eventId found, returning');
    return;
  }

  try {
    console.log('Fetching events...')
    const params = { page: parseInt(page, 10) }
    const response = await request.findEvents(params)
    console.log('All events:', response.events)

    if (response.events) {
      const foundEvent = response.events.find((e) => String(e.id) === String(currentEventId))
      console.log('Found event:', foundEvent)

      if (foundEvent) {
        console.log('Setting form values...')
        eventTitle.value = foundEvent.title
        console.log('Set title:', eventTitle.value)

        description.value = foundEvent.description
        console.log('Set description:', description.value)

        const dateValue = new Date(foundEvent.date)
        if (isNaN(dateValue.getTime())) {
          console.error('Failed to parse date:', foundEvent.date)
          return
        }

        eventDate.value = dateValue
        const isoString = dateValue.toISOString().slice(0, 16);

        const dateInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement
        if (dateInput) {
          dateInput.value = isoString
        }

        const year = dateValue.getFullYear()
        const month = String(dateValue.getMonth() + 1).padStart(2, '0')
        const day = String(dateValue.getDate()).padStart(2, '0')
        const hours = String(dateValue.getHours()).padStart(2, '0')
        const minutes = String(dateValue.getMinutes()).padStart(2, '0')
        
        eventDateString.value = `${year}-${month}-${day}T${hours}:${minutes}`
        console.log('Set date string:', eventDateString.value)

        if (foundEvent.lat && foundEvent.lon) {
          coordinates.value = {
            location: foundEvent.location,
            lat: foundEvent.lat,
            lng: foundEvent.lon
          }
        }
        
        if (foundEvent.image) {
          imageSrc.value = `https://eventio.grassbusinesslabs.uk/static/${foundEvent.image}`
        }
      } else {
        console.log('Event not found in response')
      }
    } else {
      console.log('No events in response')
    }
  } catch (error) {
    console.error('Error in loadEventData:', error)
  }
}




onMounted(async () => {
  await loadEventData();
  console.log('Form values after load:', {
    eventTitle: eventTitle.value,
    description: description.value,
    eventDateString: eventDateString.value,
    location: coordinates.value?.location,
  })
})

const minDateTime = computed(() => {
  const now = new Date();
  return now;
});

const maxDateTime = computed(() => {
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  return nextYear;
});

const onAddressSelect = (address: AddressItem) => {
  if (address.details.position) {
    coordinates.value = {
      location: address.address,
      lat: address.details.position.lat as number,
      lng: address.details.position.lng as number
    }
  } else {
    console.error('No position data found for the selected address', address)
    coordinates.value = null
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0) {
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Будь ласка, виберіть лише зображення.'
      target.value = ''
      return
    }
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string || null
    }
    reader.readAsDataURL(file);
  }
}

const submit = form.handleSubmit(async (values) => {
  const { valid } = await form.validate();
  if (!valid) {
    showError.value = true;
    errorMessage.value = 'Будь ласка, заповніть усі обов\'язкові поля.';
    return;
  }
  try {
    const body = {
      title: values.eventTitle || '',
      description: values.description || '',
      date: values.eventDate ? Math.floor(values.eventDate.getTime() / 1000) : '',
      image: `${eventId}.png`,
      city: coordinates.value?.location?.split(',').pop()?.trim() || '',
      location: coordinates.value?.location || '',
      lat: coordinates.value?.lat ?? null,
      lon: coordinates.value?.lng ?? null
    }

    let response;
    if (isEditMode.value && eventId) {
      response = await request.updateEvent(eventId, body)
    } else {
      response = await request.addEvent(body)
    }

    if (!response || !response.id) {
      throw new Error('Не отримано id івенту')
    }

    if (selectedFile.value) {
      await request.uploadEventImage(response.id, selectedFile.value)
    }

    routing.toAllEvents();
  } catch (e: any) {
    console.error('Full error:', e)
    if (e.response) {
      alert('Помилка з боку сервера: ' + JSON.stringify(e.response.data, null, 2))
    } else if (e.request) {
      alert('Запит надіслано, але відповіді не отримано: ' + e.request)
    } else {
      alert('Помилка під час налаштування запиту: ' + e.message)
    }
  }
})
const cancel = () => {
  localStorage.setItem('eventId', "")}
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
    background-color: #753737FF;
    color: #fff;
  }
  .form-actions .save:hover {
    background-color: rgb(85, 33, 33);
  }
  .form-actions .cancel {
    background-color: #ccc;
    color: #333;
  }
  .form-actions .cancel:hover {
    background-color: #999;
  }
  .image-upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-image img {
  width: 60px; 
  height: 60px;
  object-fit: cover;
  margin-top: -15px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

</style>
