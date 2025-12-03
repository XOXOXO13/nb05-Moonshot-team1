"use client";

import { useActionState, useState } from "react";
import classNames from "classnames/bind";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Label from "@/shared/components/Label";
import Modal from "@/shared/components/Modal";
import styles from "./ProjectTab.module.css";
import { inviteMember } from "../actions";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const MemberTabMenu = ({ projectId }: { projectId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, dispatch, isPending] = useActionState(
    async (prevState: { email: string }, formData: FormData) => {
      const values = {
        email: formData.get("email") as string,
      };

      const { error, success } = await inviteMember(projectId, values.email);

      if (error) {
        toast.error(error);
      }

      if (success) {
        toast.success(success);
        setIsOpen(false);
      }

      return values;
    },
    {
      email: "",
    }
  );

  return (
    <div>
      <Button type="button" onClick={() => setIsOpen(true)}>
        멤버 초대하기
      </Button>

      <Modal
        className={cx("modal")}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <h2 className={cx("modalTitle")}>멤버 초대하기</h2>
        <form className={cx("modalForm")} action={dispatch}>
          <div className={cx("inputContainer")}>
            <Label htmlFor="email">이메일</Label>
            <Input
              className={cx("modalInput")}
              id="email"
              name="email"
              defaultValue={state.email}
              placeholder="example@email.com"
            />
          </div>
          <Button
            className={cx("modalButton")}
            type="submit"
            disabled={isPending}
          >
            초대하기
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default MemberTabMenu;
