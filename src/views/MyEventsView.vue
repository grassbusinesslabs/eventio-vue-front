<template>
    <home-layout>
      <v-row 
      align="center" class="no-spacing">
         <h2 class="header">N подій</h2>
      <v-btn
        class="ma-3"
        text to="/addEvent"
      >
        <v-icon
          icon="mdi-plus-circle"
          start
        ></v-icon>
        {{translate("BTNS.ADD_EVENT")}}
      </v-btn>
   </v-row>
       <v-row class='ma-0'>
          <app-post
             v-for='post in posts'
             :key='post.id'
             :post='post'
          />
       </v-row>
    </home-layout>
 </template>
 <script lang='ts' setup>
 import type {MaybeRefOrGetter, Ref} from 'vue'
 import {onMounted, ref} from 'vue'
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
 import AppPost from '@/components/AppMyPost.vue'
 
 const {handleError} = useHandleError()
 const {translate} = useAppI18n()
 const userStore = useUserStore()
 const {currentUser} = storeToRefs(userStore)
 
 const request = requestService()
 const {vuetifyConfig, eventTitleValidator, textValidator} = formService()
 
 const posts: Ref<Post[]> = ref<Post[]>([])
 const loadingPosts = ref<boolean>(false)
 
 let lastPostId: number = 0
 
 const form = useForm({
    validationSchema: toTypedSchema(
       yup.object({
          title: eventTitleValidator(),
          text: textValidator()
       })
    ),
    initialValues: {
       title: '',
       text: ''
    }
 })
 
 const isSubmitting = ref<boolean>(false)
 const [title, titleAttrs] = form.defineField('title' as MaybeRefOrGetter, vuetifyConfig)
 const [text, textAttrs] = form.defineField('text' as MaybeRefOrGetter, vuetifyConfig)
 
 onMounted(() => {
    loadPosts()
 })
 
 async function loadPosts(): Promise<void> {
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
 }
 
 const submit = form.handleSubmit(async values => {
    try {
       if (isSubmitting.value) {
          return
       }
       isSubmitting.value = true
 
       const body: AddPostBody = {
          title: values.title,
          body: values.text,
          userId: currentUser.value.id
       }
 
       const post: Post = await request.addPost(body)
       post.id = lastPostId + 1
       lastPostId = post.id
 
       posts.value.unshift(post)
 
       form.resetForm()
 
       isSubmitting.value = false
    } catch (e) {
       console.error(e)
       handleError(e)
       isSubmitting.value = false
    }
 })
 </script>
 
 <style lang='scss' scoped>
 .header{
   margin-left: 40px;
   font-weight: normal;}
 </style>
 