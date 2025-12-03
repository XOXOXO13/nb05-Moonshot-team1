"use client";
import { startTransition, useActionState } from "react";
import Dropdown from "@/nb05-Moonshot-fe/shared/components/Dropdown";
import { TaskStatus } from "@/nb05-Moonshot-team1/types/TaskStatus";
import { updateTask } from "../actions";
import { toast } from "react-toastify";

const TaskDropdown = ({
  taskId,
  taskStatus,
}: {
  taskId: number;
  taskStatus: TaskStatus;
}) => {
  const [state, dispatch, isPending] = useActionState(
    async (prevState: TaskStatus, nextState: TaskStatus) => {
      const { error, success } = await updateTask(taskId, {
        status: nextState,
      });
      if (error) {
        toast.error(error);
        return prevState;
      }
      if (success) {
        toast.success(success);
        return nextState;
      }
      return prevState;
    },
    taskStatus
  );

  return (
    <Dropdown
      options={[
        { label: "진행 전", value: "todo" },
        { label: "진행 중", value: "in_progress" },
        { label: "완료", value: "done" },
      ]}
      value={state}
      onChange={(value) => {
        startTransition(() => {
          dispatch(value as TaskStatus);
        });
      }}
      placeholder="상태"
      disabled={isPending}
    />
  );
};

export default TaskDropdown;
