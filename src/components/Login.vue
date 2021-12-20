<template>
  <q-page class="flex flex-center">
  <q-card class="my-card">
    <q-parallax
        src="https://cdn.quasar.dev/img/parallax1.jpg" height="150"/>
    <q-card-section>{{ v }}</q-card-section>
    <p class="text-h5">teste</p>
    <q-card-actions>
      <q-btn flat>Action 1</q-btn>
      <q-btn flat>Action 2</q-btn>
    </q-card-actions>
  </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Login',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px
  centered
</style>
