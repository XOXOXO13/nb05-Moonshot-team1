"use client";

import classNames from "classnames/bind";
import Modal from "@/shared/components/Modal";
import Label from "@/shared/components/Label";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { Comment } from "@/types/entities";
import styles from "./EditCommentModal.module.css";
import { updateComment } from "../actions";
import { useActionState } from "react";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);

const EditCommentModal = ({
  taskId,
  comment,
  isOpen,
  onSubmit,
  onClose,
}: {
  taskId: number;
  comment: Comment;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const [state, dispatch, isPending] = useActionState(
    async (prevState: { content: string }, formData: FormData) => {
      const values = {
        content: formData.get("content") as string,
      };
      const { error, success } = await updateComment(
        taskId,
        comment.id,
        values
      );
      if (error) {
        toast.error(error);
      }
      if (success) {
        toast.success(success);
        onSubmit();
      }
      return values;
    },
    {
      content: comment.content,
    }
  );

  return (
    <>
      <Modal className={cx("modal")} isOpen={isOpen} onClose={onClose}>
        <h2 className={cx("title")}>댓글 수정</h2>
        <form className={cx("form")} action={dispatch}>
          <div className={cx("inputContainer")}>
            <Label>내용</Label>
            <Input
              required
              className={cx("input")}
              name="content"
              defaultValue={state.content}
              placeholder="댓글을 입력하세요"
            />
          </div>
          <Button className={cx("button")} type="submit" disabled={isPending}>
            수정하기
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditCommentModal;
