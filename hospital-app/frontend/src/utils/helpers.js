// Utility functions for common operations

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR')
}

export const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString('fr-FR')
}

export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export const validatePhone = (phone) => {
    const re = /^(\+|00|\d)[0-9\s\-\.]{8,}$/
    return re.test(phone)
}