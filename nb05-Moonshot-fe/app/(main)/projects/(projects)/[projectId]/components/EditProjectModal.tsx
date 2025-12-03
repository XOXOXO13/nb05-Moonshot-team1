"use client";

import classNames from "classnames/bind";
import { useActionState } from "react";
import Modal from "@/nb05-Moonshot-fe/shared/components/Modal";
import Label from "@/nb05-Moonshot-fe/shared/components/Label";
import Input from "@/nb05-Moonshot-fe/shared/components/Input";
import Button from "@/nb05-Moonshot-fe/shared/components/Button";
import styles from "./EditProjectModal.module.css";
import { updateProject } from "../actions";
import { Project } from "@/nb05-Moonshot-team1/types/entities";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

interface EditProjectState {
  name: string;
  description: string;
}

const EditProjectModal = ({
  project,
  isOpen,
  onSubmit,
  onClose,
}: {
  project: Project;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const [state, dispatch, isPending] = useActionState(
    async (prevState: EditProjectState, formState: FormData) => {
      const values = {
        name: formState.get("name") as string,
        description: formState.get("description") as string,
      };
      const { error, success } = await updateProject(project.id, values);
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
      name: project.name,
      description: project.description,
    }
  );

  return (
    <>
      <Modal className={cx("modal")} isOpen={isOpen} onClose={onClose}>
        <h2 className={cx("title")}>프로젝트 수정</h2>
        <form className={cx("form")} action={dispatch}>
          <div className={cx("inputContainer")}>
            <Label>프로젝트 이름</Label>
            <Input
              required
              className={cx("input")}
              name="name"
              defaultValue={state.name}
              placeholder="최대 10자"
              maxLength={10}
            />
          </div>
          <div className={cx("inputContainer")}>
            <Label>프로젝트 설명</Label>
            <Input
              className={cx("input")}
              name="description"
              defaultValue={state.description}
              placeholder="최대 40자"
              maxLength={40}
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

export default EditProjectModal;
