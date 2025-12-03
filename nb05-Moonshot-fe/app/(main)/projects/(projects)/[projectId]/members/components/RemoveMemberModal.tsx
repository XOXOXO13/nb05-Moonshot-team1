"use client";

import classNames from "classnames/bind";
import Modal from "@/nb05-Moonshot-fe/shared/components/Modal";
import Button from "@/nb05-Moonshot-fe/shared/components/Button";
import styles from "./RemoveMemberModal.module.css";
import { removeMember } from "../actions";
import { useActionState } from "react";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const RemoveMemberModal = ({
  projectId,
  userId,
  isOpen,
  onSubmit,
  onClose,
}: {
  projectId: number;
  userId: number;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const [, dispatch, isPending] = useActionState(
    async (prevState: undefined) => {
      const { error, success } = await removeMember(projectId, userId);
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
          <h2 className={cx("title")}>해당 멤버를 제외하시겠어요?</h2>
          <p className={cx("description")}>
            해당 멤버와 관련된 모든 정보가 사라지며, 되돌릴 수 없습니다.
          </p>
        </div>
        <form className={cx("form")} action={dispatch}>
          <Button
            className={cx("button")}
            appearance="danger"
            type="submit"
            disabled={isPending}
          >
            제외하기
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default RemoveMemberModal;
