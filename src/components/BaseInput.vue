<script setup>
import { nanoid } from 'nanoid'
import { HTMLInputTypes } from '../utils/constants'
import { computed, ref } from 'vue'

// Testing using model modifiers, very basic formatter that could theoretically be extended cleanly
// const formatter = (modifiers, v) => {
//     if (modifiers.capitalize) return v.charAt(0).toUpperCase() + v.slice(1)

//     return v
// }

// Props
const props = defineProps({
    // Bind model value passed from parent
    modelValue: {
        type: Object
    },
    // Bind model modifiers, enabling us to create cusom modifiers.
    // This will allow things along the lines of v-model.required.trim.uppercase="value".
    // Not positive how valuable this is, but it seems cool.
    modelModifiers: { default: () => ({}) },
    id: {
        type: String,
        default: nanoid(20)
    },
    type: {
        type: String,
        default: 'text',
        validator(value) {
            // Validate prop to ensure that type is congruent with HTML spec
            return HTMLInputTypes.includes(value)
        }
    },
    format: {
        type: Function
    },
    validators: {
        type: Array
    },
    label: {
        type: String
    },
    // Determines order of label/input. False (the default) will have label above, true will have label below
    // TODO: update this to allow for more options than just above/below (at min, left/right as well)
    inputFirst: {
        type: Boolean,
        default: false
    }
})

// Emitters
const emit = defineEmits(['update:modelValue'])

// Reactive data
const isValid = ref(undefined)
const error = ref(undefined)

// Computed
const value = computed({
    get() {
        return props.modelValue.value
    },
    set(value) {
        let formattedValue = value
        // Formatting should be done here.

        // Formatting with model modifiers (such as v-model.capitalize="ref")
        //const formattedValue = formatter(props.modelModifiers, value)

        // Formatting with a prop
        if (props.format && typeof props.format === 'function') {
            formattedValue = props.format(value)
        }

        emit('update:modelValue', { value: formattedValue, valid: isValid })
    }
})

const baseClasses = computed(() => `base-input ${props.inputFirst ? 'reversed' : ''}`)
const validityClasses = computed(() => {
    if (isValid.value === undefined) return

    return isValid.value ? 'valid' : 'invalid'
})
// Watchers

// Lifecycle Methods

// Non-reactive methods
const handleValidation = () => {
    props.validators.forEach((fn) => {
        if (typeof fn !== 'function') return

        const { valid, errorMsg } = fn(value.value)

        isValid.value = valid

        if (errorMsg) error.value = errorMsg
        else error.value = undefined

        emit('update:modelValue', { value, valid: isValid.value })
    })
}
</script>

<template>
    <div :class="baseClasses">
        <label :for="id" class="base-input__label">
            <slot name="label"> {{ label }} </slot>
            <span v-if="error !== undefined" class="base-input__error"> {{ error }}</span>
        </label>
        <input
            :type="type"
            :id="id"
            v-model="value"
            :class="validityClasses"
            @blur="handleValidation"
        />
    </div>
</template>

<style scoped>
.base-input {
    /* Setup Flexbox */
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    flex-direction: column;
}

.base-input__label {
    display: flex;
    justify-content: space-between;
}

.base-input__error {
    color: red;
}

.reversed {
    /* Reverse Column Order */
    -webkit-flex-flow: column-reverse;
    flex-flow: column-reverse;
}

.valid {
    border-color: green;
}

.invalid {
    border-color: red;
}
</style>
