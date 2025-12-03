"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import { toast } from "react-toastify";
import Modal from "@/nb05-Moonshot-fe/shared/components/Modal";
import Label from "@/nb05-Moonshot-fe/shared/components/Label";
import Input from "@/nb05-Moonshot-fe/shared/components/Input";
import Button from "@/nb05-Moonshot-fe/shared/components/Button";
import { createProject, CreateProjectInput } from "../actions";
import styles from "./CreateProject.module.css";

const cx = classNames.bind(styles);

const CreateProject = () => {
  const router = useRouter();
  const [state, dispatch, isPending] = useActionState(
    async (_: CreateProjectInput, formData: FormData) => {
      const values = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };
      const result = await createProject(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        router.push(`/projects/${result.data?.id}`);
      }
      return values;
    },
    {
      name: "",
      description: "",
    }
  );
  const [isOpen, setIsOpen] = useState(false);
  const handleButtonClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button className={cx("createProjectButton")} onClick={handleButtonClick}>
        + 새 프로젝트
      </button>
      <Modal
        className={cx("modal")}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <h2 className={cx("title")}>프로젝트 만들기</h2>
        <form className={cx("form")} action={dispatch}>
          <div className={cx("inputContainer")}>
            <Label>프로젝트 이름</Label>
            <Input
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
            만들기
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default CreateProject;
