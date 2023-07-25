<script setup>
import BaseInput from './components/BaseInput.vue'
import { useFormStore } from '@/stores/form'
import { formatters } from './utils/format'
import { name } from './utils/validators'

const store = useFormStore()
const form = store.form
const handleSubmit = () => {
    console.log(store.allValid)
}
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <BaseInput
            label="First Name"
            v-model="form.firstName"
            :format="formatters.UPPERCASE"
            :validators="name"
        />

        <BaseInput
            label="Last Name"
            v-model="form.lastName"
            :format="formatters.UPPERCASE"
            :validators="name"
        />
        <button>Submit</button>
    </form>
</template>

<style scoped></style>
