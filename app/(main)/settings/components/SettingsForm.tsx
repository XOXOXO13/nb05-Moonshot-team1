"use client";

import classNames from "classnames/bind";
import { useActionState } from "react";
import ImageInput from "@/shared/components/ImageInput";
import Input from "@/shared/components/Input";
import Label from "@/shared/components/Label";
import Button from "@/shared/components/Button";
import styles from "./SettingsForm.module.css";
import { User } from "@/nb05-Moonshot-team1/types/entities";
import { toast } from "react-toastify";
import { updateMe } from "../actions";

const cx = classNames.bind(styles);

interface PasswordState {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const SettingsForm = ({ user }: { user: User }) => {
  const [passwordState, dispatchPassword, isPendingPassword] = useActionState(
    async (prevState: PasswordState, formData: FormData) => {
      const currentPassword = formData.get("currentPassword") as string;
      const newPassword = formData.get("newPassword") as string;
      const newPasswordConfirm = formData.get("newPasswordConfirm") as string;

      if (newPassword !== newPasswordConfirm) {
        toast.error("비밀번호가 일치하지 않습니다.");
        return {
          currentPassword,
          newPassword,
          newPasswordConfirm,
        };
      }

      const { success, error } = await updateMe({
        currentPassword,
        newPassword,
      });

      if (error) {
        toast.error(error);
      }
      if (success) {
        toast.success("내 정보 수정 성공");
        return {
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        };
      }
      return {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      };
    },
    {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  );

  const handleChangeProfileImage = async (profileImage: string | null) => {
    const { error, success } = await updateMe({
      profileImage,
    });
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("프로필 이미지 수정 성공");
    }
  };

  return (
    <>
      <h1 className={cx("title")}>정보 수정</h1>
      <div>
        <div className={cx("inputContainer")}>
          <Label>프로필 이미지</Label>
          <ImageInput
            url={user.profileImage}
            onChange={handleChangeProfileImage}
          />
        </div>
        <div className={cx("inputContainer")}>
          <Label>닉네임</Label>
          <Input
            className={cx("input")}
            defaultValue={user.name}
            placeholder="nickname"
            disabled
          />
        </div>
        <div className={cx("inputContainer")}>
          <Label>이메일</Label>
          <Input
            className={cx("input")}
            type="email"
            defaultValue={user.email}
            placeholder="example@email.com"
            disabled
          />
        </div>
      </div>
      <hr className={cx("divider")} />
      <form action={dispatchPassword}>
        <h2>비밀번호 변경하기</h2>
        <div className={cx("inputContainer")}>
          <Label>기존 비밀번호</Label>
          <Input
            className={cx("input")}
            type="password"
            name="currentPassword"
            defaultValue={passwordState.currentPassword}
            placeholder="기존 비밀번호"
          />
        </div>
        <div className={cx("inputContainer")}>
          <Label>새 비밀번호</Label>
          <Input
            className={cx("input")}
            type="password"
            name="newPassword"
            defaultValue={passwordState.newPassword}
            placeholder="새 비밀번호"
          />
        </div>
        <div className={cx("inputContainer")}>
          <Label>새 비밀번호 확인</Label>
          <Input
            className={cx("input")}
            type="password"
            name="newPasswordConfirm"
            defaultValue={passwordState.newPasswordConfirm}
            placeholder="새 비밀번호 확인"
          />
        </div>
        <Button
          className={cx("button")}
          type="submit"
          disabled={isPendingPassword}
        >
          수정하기
        </Button>
      </form>
    </>
  );
};

export default SettingsForm;
