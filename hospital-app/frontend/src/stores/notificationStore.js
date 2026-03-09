import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([])

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now()
        const notif = { id, message, type }

        notifications.value.push(notif)

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }

        return id
    }

    const removeNotification = (id) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
            notifications.value.splice(index, 1)
        }
    }

    const success = (message, duration = 5000) => addNotification(message, 'success', duration)
    const error = (message, duration = 5000) => addNotification(message, 'error', duration)
    const info = (message, duration = 5000) => addNotification(message, 'info', duration)

    return {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        info
    }
})
