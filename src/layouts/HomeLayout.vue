<template>
  <v-layout >
    <app-header 
      class="app-header"
      v-model:drawer="drawer"
      v-model:filterDrawer="filterDrawer"
    />
    
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      fixed
      class="drawer"
      :width="275"
    >
      <v-list>
        <v-list-item class="justify-center pa-4">
          <v-list-item-title v-if="!isEditing" class="card-title text-center">
            {{ userFullName }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="comfortable" nav class="mt-2">
        <v-list-item
          to="/profile"
          class="drawer-item"
        >
          <v-list-item-title class="drawer-item-text">
            Особистий кабінет
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="!isEditing"
          @click="logout"
          class="drawer-item-sign-out"
        >
          <v-list-item-title class="drawer-item-text">
            {{ translate('BTNS.LOGOUT') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item class="justify-end pa-4" >
          <v-list-item-title class="drawer-item-text">
          <app-select-lang />
          <app-url-select />
        </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="filterDrawer"
      location="right"
      temporary
      class="filter-drawer"
      :width="275"
    >
      <slot name="filter-content" />
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-3">
      <v-container class="container" fill-height>
        <v-row justify="center" align="start">
          <v-col cols="12" md="10" lg="10">
            <v-sheet
              min-height="80vh"
              max-width="100%"
              rounded="lg"
              class="pa-1 justify-center align-start"
            >
              <slot />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'
import { useAppI18n } from '@/i18n'
import AppSelectLang from "@/components/AppSelectLang.vue"
import AppUrlSelect from '@/components/AppUrlSelect.vue'

const { translate } = useAppI18n()
const drawer = ref(false)
const filterDrawer = ref(false)
const isEditing = ref(false)

const userStore = useUserStore()
const { logout } = userStore
const { currentUser } = storeToRefs(userStore)

const userFullName = computed(() => {
  if (currentUser.value) {
    const { firstName, secondName } = currentUser.value
    return `${firstName || ''} ${secondName || ''}`.trim()
  }
  return ''
})
</script>
 
 <style lang="scss" scoped>
 .app-header {
   position: absolute;
   z-index: 1000;
   height: auto;
   overflow: visible;
 }
 
 .drawer {
   :deep(.v-list) {
     display: flex;
     flex-direction: column;
   }
 }
 
 .card-title {
   font-size: 24px !important;
   text-align: center !important;
   width: 100%;
 }
 
 .drawer-item {
   display: flex;
   justify-content: center;
   padding: 12px 24px;
   
   :deep(.drawer-item-text) {
     font-size: 18px !important;
     text-align: center !important;

   }
 }
 .drawer-item-sign-out{
   display: flex;
   justify-content: center;
   padding: 12px 24px;
   background-color: #eaeaea;
   
   :deep(.drawer-item-text) {
     font-size: 18px !important;
     text-align: center !important;

   }
 }
 :deep(.v-list-item-title) {
   width: 100%;
   text-align: center;
 }
 </style>