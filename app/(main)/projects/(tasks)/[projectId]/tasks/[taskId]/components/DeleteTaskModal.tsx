"use client";

import { useActionState } from "react";
import classNames from "classnames/bind";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import styles from "./DeleteTaskModal.module.css";
import { deleteTask } from "../actions";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const DeleteTaskModal = ({
  taskId,
  isOpen,
  onSubmit,
  onClose,
}: {
  taskId: number;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const [, dispatch, isPending] = useActionState(async () => {
    const { success, error } = await deleteTask(taskId);
    if (success) {
      toast.success(success);
      onSubmit();
    }
    if (error) {
      toast.error(error);
    }
  }, undefined);

  return (
    <>
      <Modal className={cx("modal")} isOpen={isOpen} onClose={onClose}>
        <div className={cx("content")}>
          <h2 className={cx("title")}>할 일을 삭제하시겠어요?</h2>
          <p className={cx("description")}>
            해당 할 일과 관련된 모든 정보가 사라지며, 되돌릴 수 없습니다.
          </p>
        </div>
        <form className={cx("form")} action={dispatch}>
          <Button
            className={cx("button")}
            appearance="danger"
            type="submit"
            disabled={isPending}
          >
            삭제하기
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default DeleteTaskModal;
