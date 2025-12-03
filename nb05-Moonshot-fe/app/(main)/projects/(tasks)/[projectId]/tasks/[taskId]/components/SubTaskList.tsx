"use client";

import classNames from "classnames/bind";
import { startTransition, useActionState } from "react";
import { toast } from "react-toastify";
import styles from "./SubTaskList.module.css";
import CloseButton from "@/assets/close-button.svg";
import Input from "@/shared/components/Input";
import { SubTask } from "@/types/entities";
import { TaskStatus } from "@/types/TaskStatus";
import { createSubtask, deleteSubtask, updateSubtask } from "../actions";

const cx = classNames.bind(styles);

const SubTaskItem = ({
  taskId,
  subTask,
}: {
  taskId: number;
  subTask: SubTask;
}) => {
  const [, dispatchUpdate] = useActionState(
    async (prevState: TaskStatus, nextState: TaskStatus) => {
      const { error, success } = await updateSubtask(taskId, subTask.id, {
        status: nextState,
      });
      if (error) {
        toast.error(error);
      }
      if (success) {
        toast.success(success);
      }
      return nextState;
    },
    subTask.status
  );

  const [, dispatchDelete] = useActionState(async () => {
    const { error, success } = await deleteSubtask(taskId, subTask.id);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
  }, undefined);

  return (
    <div className={cx("subTask")} key={subTask.id}>
      <Input
        className={cx("checkbox")}
        type="checkbox"
        checked={subTask.status === TaskStatus.done}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const isChecked = e.target.checked;
          startTransition(() => {
            dispatchUpdate(isChecked ? TaskStatus.done : TaskStatus.todo);
          });
        }}
      />
      <span className={cx("subTaskTitle")}>{subTask.title}</span>
      <CloseButton
        className={cx("closeButton")}
        onClick={() => {
          startTransition(() => {
            dispatchDelete();
          });
        }}
      />
    </div>
  );
};

const SubTaskList = ({
  taskId,
  subTasks,
}: {
  taskId: number;
  subTasks: SubTask[];
}) => {
  const [state, dispatchCreate, isPendingCreate] = useActionState(
    async (prevState: { title: string }, formState: FormData) => {
      const values = {
        title: formState.get("title") as string,
      };
      const { error, success } = await createSubtask(taskId, values);
      if (error) {
        toast.error(error);
      }
      if (success) {
        toast.success(success);
        return { title: "" };
      }
      return values;
    },
    { title: "" }
  );

  return (
    <div className={cx("container")}>
      <h2 className={cx("title")}>하위 할 일</h2>
      {subTasks.map((subTask) => (
        <SubTaskItem key={subTask.id} taskId={taskId} subTask={subTask} />
      ))}
      <form action={dispatchCreate}>
        <Input
          className={cx("subTaskInput")}
          name="title"
          defaultValue={state.title}
          placeholder="하위 할 일 입력하기"
          disabled={isPendingCreate}
        />
      </form>
    </div>
  );
};

export default SubTaskList;
