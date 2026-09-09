import React from 'react'
import Modal from './Modal'
import Button from './Button'

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={isDangerous ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
