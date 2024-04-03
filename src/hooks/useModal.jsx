import { Modal } from "antd";
import React, { useState } from "react";

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const ModalComp = ({ children, ...props }) => {
    return <Modal {...props}>{children}</Modal>;
  };
  return { Modal: ModalComp, isOpen: isModalOpen, openModal, closeModal };
};

export default useModal;
