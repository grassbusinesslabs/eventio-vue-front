<template>
    <home-layout>
       <v-sheet class='mx-auto'>
             <v-row class='ma-0'>
               <h2 class="element">Всі заходи</h2>
               </v-row>
       </v-sheet>
       <v-row class="d-flex align-center ma-0">
   <v-col cols="auto">
      <v-btn-toggle v-model="selectedDateValue"
                    @change="handleToggleChange">
         <v-btn value="all" variant="outlined">
            {{ translate('INPUTS.ALL') }}
         </v-btn>
         <v-btn value="past" variant="outlined">
            {{ translate('INPUTS.PAST') }}
         </v-btn>
         <v-btn value="future" variant="outlined">
            {{ translate('INPUTS.FUTURE') }}
         </v-btn>
      </v-btn-toggle>
   </v-col>
   <v-col cols="auto" class="d-flex align-center">
      <v-text-field  
                  :placeholder="translate('INPUTS.SEARCH')"
                  v-model="searchQuery"
                  variant="plain"
                  class="search-input"
                  density="comfortable">
         <v-icon left>mdi-magnify</v-icon>
      </v-text-field>
   </v-col>
</v-row>
       <v-row class='ma-0'>
          <app-post
             v-for='post in filteredPosts'
             :key='post.id'
             :post='post'
          />
       </v-row>
    </home-layout>
 </template>
 <script lang='ts' setup>
 import type {MaybeRefOrGetter, Ref} from 'vue'
 import {onMounted, ref, computed} from 'vue'
 import {useForm} from 'vee-validate'
 import {toTypedSchema} from '@vee-validate/yup'
 import {storeToRefs} from 'pinia'
 import * as yup from 'yup'
 
 import type {AddPostBody, GetPostsResponse, Post} from '@/models'
 import {formService, requestService} from '@/services'
 import {useHandleError} from '@/composables'
 import {useAppI18n} from '@/i18n'
 import {useUserStore} from '@/stores'
 import HomeLayout from '@/layouts/HomeLayout.vue'
 import AppPost from '@/components/AppPost.vue'
 
 const {handleError} = useHandleError()
 const {translate} = useAppI18n()
 const userStore = useUserStore()
 const {currentUser} = storeToRefs(userStore)
 
 const request = requestService()
 const {vuetifyConfig, eventTitleValidator, textValidator} = formService()
 
 const posts: Ref<Post[]> = ref<Post[]>([])
 const loadingPosts = ref<boolean>(false)
 
 let lastPostId: number = 0
 
 const isSubmitting = ref<boolean>(false)

 const selectedDateValue = ref('all')
 const searchQuery = ref<string>('')

 /*const filteredPosts = computed(() => {
   return posts.value.filter(post => {
     const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                           post.body.toLowerCase().includes(searchQuery.value.toLowerCase());

     if (selectedDateValue.value === 'past') {
       return matchesSearch && new Date(post.date) < new Date();
     } else if (selectedDateValue.value === 'future') {
       return matchesSearch && new Date(post.date) >= new Date();
     }

     return matchesSearch; // 'all'
   })
 })*/


 //const [title, titleAttrs] = form.defineField('title' as MaybeRefOrGetter, vuetifyConfig)
 //const [text, textAttrs] = form.defineField('text' as MaybeRefOrGetter, vuetifyConfig)
 
 /*onMounted(() => {
    loadPosts()
 })*/
 
 /*async function loadPosts(): Promise<void> {
    try {
       loadingPosts.value = true
 
       const response: GetPostsResponse = await request.getPosts()
       posts.value = response.posts
       lastPostId = response.total
 
       loadingPosts.value = false
    } catch (e) {
       console.error(e)
       handleError(e)
       posts.value = []
       loadingPosts.value = false
    }
 }*/
 </script>
 
 <style lang='scss' scoped>
 .element {  
  margin: 10px 20px 0px 15px;
}  
.search-input {
   padding: 0px 10px;
   font-size: 14px;
   border: 1px solid #ccc;
   border-radius: 4px;
   width: 380px;
   height: 50px;
   margin-left: 0px;
}
 </style>
 