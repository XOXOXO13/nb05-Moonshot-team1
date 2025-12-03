"use client";

import { useActionState, useState } from "react";
import classNames from "classnames/bind";
import Modal from "@/nb05-Moonshot-fe/shared/components/Modal";
import Label from "@/nb05-Moonshot-fe/shared/components/Label";
import Input, { Textarea } from "@/nb05-Moonshot-fe/shared/components/Input";
import Button from "@/nb05-Moonshot-fe/shared/components/Button";
import TagInput from "@/nb05-Moonshot-fe/shared/components/TagInput";
import FileInput from "@/nb05-Moonshot-fe/shared/components/FileInput";
import styles from "./EditTaskModal.module.css";
import { UpdateTaskPayload, Task } from "@/nb05-Moonshot-team1/types/entities";
import { updateTask } from "../actions";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const EditTaskModal = ({
  task,
  isOpen,
  onSubmit,
  onClose,
}: {
  task: Task;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const [tags, setTags] = useState<string[]>(task.tags.map((tag) => tag.name));
  const [attachments, setAttachments] = useState<string[]>(
    task.attachments || []
  );
  const [state, dispatch, isPending] = useActionState(
    async (prevState: UpdateTaskPayload, formData: FormData) => {
      const startDate = new Date(formData.get("startDate") as string);
      const endDate = new Date(formData.get("endDate") as string);

      if (startDate > endDate) {
        toast.error("시작일자가 종료일자보다 클 수 없습니다.");
        return prevState;
      }

      const [startYear, startMonth, startDay] = startDate
        .toISOString()
        .split("T")[0]
        .split("-")
        .map(Number);
      const [endYear, endMonth, endDay] = endDate
        .toISOString()
        .split("T")[0]
        .split("-")
        .map(Number);

      const payload: UpdateTaskPayload = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        startYear,
        startMonth,
        startDay,
        endYear,
        endMonth,
        endDay,
      };
      const { error, success } = await updateTask(task.id, {
        ...payload,
        tags,
        attachments,
      });
      if (error) {
        toast.error(error);
      } else if (success) {
        toast.success(success);
        onSubmit();
      }
      return payload;
    },
    {
      title: task.title,
      description: task.description,
      status: task.status,
      startYear: task.startYear,
      startMonth: task.startMonth,
      startDay: task.startDay,
      endYear: task.endYear,
      endMonth: task.endMonth,
      endDay: task.endDay,
    }
  );

  return (
    <>
      <Modal className={cx("modal")} isOpen={isOpen} onClose={onClose}>
        <h2 className={cx("title")}>할 일 수정</h2>
        <form className={cx("form")} action={dispatch}>
          <div className={cx("inputContainer")}>
            <Label>제목</Label>
            <Input
              className={cx("input")}
              name="title"
              defaultValue={state.title}
              placeholder="최대 10자"
              maxLength={10}
            />
          </div>
          <div className={cx("inputContainer")}>
            <Label>내용</Label>
            <Textarea
              className={cx("input")}
              name="description"
              defaultValue={state.description}
              placeholder="최대 40자"
              maxLength={40}
            />
          </div>
          <div className={cx("inputContainer")}>
            <Label>태그</Label>
            <TagInput value={tags} onChange={setTags} maxTags={5} />
          </div>
          <div className={cx("twoColumn")}>
            <div className={cx("inputContainer")}>
              <Label>시작일자</Label>
              <Input
                className={cx("input")}
                name="startDate"
                type="date"
                defaultValue={
                  new Date(
                    state.startYear!,
                    state.startMonth! - 1,
                    state.startDay!
                  )
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
            <div className={cx("inputContainer")}>
              <Label>종료일자</Label>
              <Input
                className={cx("input")}
                name="endDate"
                type="date"
                defaultValue={
                  new Date(state.endYear!, state.endMonth! - 1, state.endDay!)
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
          </div>
          <div className={cx("inputContainer")}>
            <Label>파일 첨부</Label>
            <FileInput urls={attachments} onChange={setAttachments} />
          </div>
          <Button className={cx("button")} type="submit" disabled={isPending}>
            등록하기
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditTaskModal;
