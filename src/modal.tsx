// Modal.tsx
import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          margin: "4px",
          maxWidth: "50%", // Réduire la largeur maximale à 50%
          width: "100%",
          padding: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
            borderBottom: "2px solid #eee", // Ajouter une bordure pour séparer les articles
          }}
        >
          <h2
            style={{ fontSize: "2em", fontWeight: "bold", marginLeft: "5px" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              fontSize: "1.5em", // Augmenter la taille de la croix
              color: "black",
              marginRight: "10px",
              padding: "5px", // Ajouter du padding pour augmenter la zone cliquable
            }}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body // Ceci place le modal au niveau le plus haut dans le DOM.
  );
};

export default Modal;
