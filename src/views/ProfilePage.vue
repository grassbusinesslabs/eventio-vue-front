<template>
  <profile-layout>
    <div class="profile-layout">
      <div class="sidebar grey lighten-3">
        <v-tabs
        color="#3E3B3BFF"
        direction="vertical"
      >
          <v-tab class="v-tab"
            to="/myEvents"
            :active="currentSection === 'my-events'"
            @click="currentSection = 'my-events'"
          >
            {{ translate("BTNS.MY_EVENTS") }}
          </v-tab>

          <v-tab class="v-tab"
            to="/profile"
            :active="currentSection === 'account'"
            @click="currentSection = 'account'"
          >
            {{ translate("MENU.ACCOUNT_SETTINGS") }}
          </v-tab>

          <v-tab class="v-tab"
          to="/" @click="goBack" prepend-icon="mdi-arrow-left">
            {{ translate("BTNS.GO_BACK") }}
          </v-tab>
          </v-tabs>
      </div>

      <div class="main-content">
        <div v-if="currentSection === 'account'" class="content-section">
          <h2 class="text-h5 mb-6 text-center">
            {{ translate("TITLES.EDIT_PROFILE") }}
          </h2>

          <v-form @submit.prevent="submit" class="form-container">
            <v-text-field
              v-model="firstName"
              v-bind="firstNameAttrs"
              :label="translate('INPUTS.FIRST_NAME')"
              variant="outlined"
              class="mb-4"
              :disabled="isSubmitting"
            />

            <v-text-field
              v-model="secondName"
              v-bind="secondNameAttrs"
              :label="translate('INPUTS.LAST_NAME')"
              variant="outlined"
              class="mb-4"
              :disabled="isSubmitting"
            />

            <v-text-field
              v-model="email"
              v-bind="emailAttrs"
              :label="translate('INPUTS.EMAIL')"
              variant="outlined"
              class="mb-4"
              :disabled="isSubmitting"
            />

            <v-btn
            class=" ml-auto"
                size="large"
              type="submit"
              :loading="isSubmitting"
            >
              {{ translate('BTNS.SAVE') }}
            </v-btn>
          </v-form>

          <v-divider class="my-8"></v-divider>

          <v-btn
            color="error"
            variant="outlined"
            @click="showDeleteConfirm = true"
          >
            {{ translate('BTNS.DELETE') }}
          </v-btn>
        </div>

        <div v-if="currentSection === 'my-events'" class="content-section">
          <v-row align="center" class="mb-6">
            <v-col>
              <h2 class="text-h5" >
                {{ events.length }} {{ translate("TEXT.EVENTS") }}
              </h2>
            </v-col>
            <v-col cols="auto">
              <v-btn
          class=" ml-auto"
                to="/addEvent"
                size="large"
                prepend-icon="mdi-plus-circle"
              >
                {{ translate("BTNS.ADD_EVENT") }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row >
            <app-post v-for="event in events" :key="event.id" :event="event" />
          </v-row>
        </div>
      </div>
    </div>

    <v-dialog v-model="showDeleteConfirm" max-width="400">
      <v-card>
        <v-card-title class="text-center">
          {{ translate('DIALOGS.DELETE_ACCOUNT_TITLE') }}
        </v-card-title>
        <v-card-text>
          {{ translate('DIALOGS.DELETE_ACCOUNT_CONFIRM') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showDeleteConfirm = false">
            {{ translate('BTNS.CANCEL') }}
          </v-btn>
          <v-btn
            color="error"
            @click="deleteAccount"
            :loading="isDeletingAccount"
          >
            {{ translate('BTNS.DELETE') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </profile-layout>
</template>
  
  <script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/yup'
  import { storeToRefs } from 'pinia'
  import * as yup from 'yup'
  import type { Event } from '@/models'
  import { formService, requestService } from '@/services'
  import { useHandleError } from '@/composables'
  import { useAppI18n } from '@/i18n'
  import { useUserStore } from '@/stores'
  import ProfileLayout from '@/layouts/ProfileLayout.vue'
  import AppPost from '@/components/AppMyPost.vue'
  
  const route = useRoute()
  const router = useRouter()
  const request = requestService()
  const { handleError } = useHandleError()
  const { translate } = useAppI18n()
  const { vuetifyConfig, emailValidator, nameValidator } = formService()
  
  const userStore = useUserStore()
  const { logout, setCurrentUser } = userStore
  const { currentUser } = storeToRefs(userStore)
  
  const currentSection = ref(route.path.includes('my-events') ? 'my-events' : 'account')
  const events = ref<Event[]>([])
  const loadingEvents = ref(false)
  const isSubmitting = ref(false)
  const isDeletingAccount = ref(false)
  const showDeleteConfirm = ref(false)
  
  const form = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        firstName: nameValidator(),
        secondName: nameValidator(),
        email: emailValidator(),
      })
    ),
    initialValues: {
      firstName: currentUser.value?.firstName || '',
      secondName: currentUser.value?.secondName || '',
      email: currentUser.value?.email || '',
    },
  })
  
  const [firstName, firstNameAttrs] = form.defineField('firstName', vuetifyConfig)
  const [secondName, secondNameAttrs] = form.defineField('secondName', vuetifyConfig)
  const [email, emailAttrs] = form.defineField('email', vuetifyConfig)
  
  const goBack = () => {
    router.push('/')
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
        currentUser.value= {
          ...currentUser.value,
          ...body
        }
        setCurrentUser(currentUser.value)
      }
    } catch (error) {
      handleError(error)
    } finally {
      isSubmitting.value = false
    }
  })
  
  const deleteAccount = async () => {
    try {
      isDeletingAccount.value = true
      //await request.deleteUser()
      await logout()
      router.push('/login')
    } catch (error) {
      handleError(error)
    } finally {
      isDeletingAccount.value = false
      showDeleteConfirm.value = false
    }
  }
  
  async function loadEvents(): Promise<void> {
    try {
      loadingEvents.value = true
      const response = await request.getMyEvents()
      events.value = response.events || []
    } catch (error) {
      console.error(error)
      handleError(error)
      events.value = []
    } finally {
      loadingEvents.value = false
    }
  }
  
  onMounted(() => {
    if (currentSection.value === 'my-events') {
      userStore.populate();
      loadEvents()
    }
  })
  
  watch(currentSection, (newValue) => {
    if (newValue === 'my-events') {
      userStore.populate();
      loadEvents()
    }
  })
  </script>
  
  <style lang="scss" scoped>
.profile-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.sidebar {
  width: 260px;
  top: 64px;
  left: 0;
  bottom: 0;
  margin-top: 20px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
}

.main-content {
    
  flex: 1;
  padding: 24px;
  padding-left: 0px;
  padding-right: 0px;
  background-color: white;
  
}

.content-section {
  max-width: 670px;
  margin: 0 auto;
}
.tool-bar{
    width: 170px;
}
.v-tab{
    height: 130px;
}
  </style>