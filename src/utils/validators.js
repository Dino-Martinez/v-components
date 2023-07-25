export const required = (v) => {
    const errorMsg = 'Required field.'
    if (typeof v === 'boolean' && v !== true) return { valid: false, errorMsg }
    if (v.length <= 0) return { valid: false, errorMsg }
    return { valid: true }
}

export const name = [required]
