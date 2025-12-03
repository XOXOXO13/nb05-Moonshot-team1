"use client";

import classNames from "classnames/bind";
import { useActionState } from "react";
import { toast } from "react-toastify";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import styles from "./DeleteProjectModal.module.css";
import { deleteProject } from "../actions";

const cx = classNames.bind(styles);

const DeleteProjectModal = ({
  projectId,
  isOpen,
  onSubmit,
  onClose,
}: {
  projectId: number;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const [, dispatch, isPending] = useActionState(
    async (prevState: undefined) => {
      const { error, success } = await deleteProject(projectId);
      if (error) {
        toast.error(error);
      }

      if (success) {
        toast.success(success);
        onSubmit();
      }
      return prevState;
    },
    undefined
  );

  return (
    <>
      <Modal className={cx("modal")} isOpen={isOpen} onClose={onClose}>
        <div className={cx("content")}>
          <h2 className={cx("title")}>해당 프로젝트를 삭제하시겠어요?</h2>
          <p className={cx("description")}>
            프로젝트와 관련된 모든 정보가 사라지며, 되돌릴 수 없습니다.
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

export default DeleteProjectModal;
