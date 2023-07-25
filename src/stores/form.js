import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', () => {
    const form = ref({
        firstName: { value: '', valid: undefined },
        lastName: { value: '', valid: undefined }
    })

    const allValid = computed(() => {
        // Dynamically iterate over form entries, accumulating a validity state
        const x = Object.entries(form.value).reduce((a, curr) => {
            return a && curr[1].valid === true
        }, true)
        return x
    })

    return { form, allValid }
})

// I changed my mind on the below. I actually think that the composition syntax will lead to more readable and maintainable code
// Using Options syntax as for complex state, I find that setup gets far too cumbersome
// Spefically, having to either define each individual value with its own 'const x = ref()' line, or alternatively
// having to mess around with reactive() and a big js object, yuck
// NOTE: using setup syntax allows for far more powerful stores, as you can use most vue functionality like injection and composables
