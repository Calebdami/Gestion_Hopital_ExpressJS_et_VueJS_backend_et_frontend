import { ref } from 'vue'

export const useConfirmation = () => {
  const showConfirmModal = ref(false)
  const confirmMessage = ref('')
  const confirmCallback = ref(null)
  const confirmType = ref('warning')

  const confirm = (message, callback, type = 'warning') => {
    confirmMessage.value = message
    confirmCallback.value = callback
    confirmType.value = type
    showConfirmModal.value = true
  }

  const handleConfirm = () => {
    showConfirmModal.value = false
    if (confirmCallback.value) {
      confirmCallback.value()
    }
  }

  const handleCancel = () => {
    showConfirmModal.value = false
    confirmCallback.value = null
  }

  return {
    showConfirmModal,
    confirmMessage,
    confirmType,
    confirm,
    handleConfirm,
    handleCancel
  }
}
