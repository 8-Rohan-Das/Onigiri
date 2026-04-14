import React from 'react';
import './PopupModal.css';

const PopupModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  onConfirm,
  showCancel = true,
  icon = null
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getModalClass = () => {
    switch (type) {
      case 'success':
        return 'modal-success';
      case 'warning':
        return 'modal-warning';
      case 'error':
        return 'modal-error';
      case 'confirm':
        return 'modal-confirm';
      default:
        return 'modal-info';
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'confirm':
        return 'help';
      default:
        return 'info';
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-container ${getModalClass()}`}>
        <div className="modal-header">
          <div className="modal-icon">
            {icon || <span className={`icon-${getDefaultIcon()}`}></span>}
          </div>
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          {showCancel && (
            <button className="modal-btn modal-btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button className="modal-btn modal-btn-confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
