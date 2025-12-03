"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames/bind";
import CloseButton from "@/public/assets/close-button.svg";
import styles from "./Modal.module.css";

const cx = classNames.bind(styles);

const Modal = ({
  className,
  isOpen,
  children,
  onClose,
}: {
  className?: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const preventClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const lockScroll = () => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "16px";
  };

  const unlockScroll = () => {
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0";
  };

  useEffect(() => {
    if (isOpen) {
      lockScroll();

      return () => {
        unlockScroll();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root")!;

  return ReactDOM.createPortal(
    <div className={cx("backdrop")} onClick={onClose}>
      <div className={cx("modal", className)} onClick={preventClose}>
        {children}
        <CloseButton className={cx("closeButton")} onClick={onClose} />
      </div>
    </div>,
    modalRoot,
  );
};

export default Modal;
