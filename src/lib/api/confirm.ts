import Swal from 'sweetalert2'

type ConfirmActionOptions = {
  title: string
  text?: string
  confirmText?: string
  cancelText?: string
  icon?: 'warning' | 'question' | 'info' | 'success' | 'error'
}

export async function confirmAction({
  title,
  text,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = 'warning',
}: ConfirmActionOptions) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    background: '#ffffff',
    color: '#0b1f1e',
    confirmButtonColor: '#007473',
    cancelButtonColor: '#d1d5db',
    customClass: {
      popup: 'rounded-3xl',
      confirmButton: 'rounded-xl',
      cancelButton: 'rounded-xl',
    },
  })

  return result.isConfirmed
}