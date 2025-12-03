"use client";

import classNames from "classnames/bind";
import { useActionState } from "react";
import { toast } from "react-toastify";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import styles from "./DeleteCommentModal.module.css";
import { deleteComment } from "../actions";

const cx = classNames.bind(styles);

const DeleteCommentModal = ({
  taskId,
  commentId,
  isOpen,
  onSubmit,
  onClose,
}: {
  taskId: number;
  commentId: number;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const [, dispatch, isPending] = useActionState(async () => {
    const { error, success } = await deleteComment(taskId, commentId);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
      onSubmit();
    }
    return undefined;
  }, undefined);

  return (
    <>
      <Modal className={cx("modal")} isOpen={isOpen} onClose={onClose}>
        <div className={cx("content")}>
          <h2 className={cx("title")}>해당 댓글을 삭제하시겠어요?</h2>
          <p className={cx("description")}>지운 댓글은 복구가 불가합니다.</p>
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

export default DeleteCommentModal;
