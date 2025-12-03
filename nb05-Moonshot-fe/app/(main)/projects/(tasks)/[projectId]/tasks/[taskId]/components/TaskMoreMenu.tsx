"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import PopoverMenu from "@/shared/components/PopoverMenu";
import MoreVertical from "@/assets/more-vertical.svg";
import { Task } from "@/types/entities";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import styles from "./TaskMoreMenu.module.css";

const cx = classNames.bind(styles);

const TaskMoreMenu = ({
  className,
  projectId,
  task,
}: {
  className?: string;
  projectId: number;
  task: Task;
}) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    "edit" | "delete" | null
  >(null);

  return (
    <>
      <PopoverMenu
        className={cx(className)}
        icon={<MoreVertical className={cx("icon")} />}
        onChange={setSelectedOption}
        options={[
          {
            label: "수정",
            value: "edit",
          },
          {
            label: "삭제",
            value: "delete",
          },
        ]}
      />
      <EditTaskModal
        task={task}
        isOpen={selectedOption === "edit"}
        onClose={() => setSelectedOption(null)}
        onSubmit={() => setSelectedOption(null)}
      />
      <DeleteTaskModal
        taskId={task.id}
        isOpen={selectedOption === "delete"}
        onClose={() => setSelectedOption(null)}
        onSubmit={() => {
          setSelectedOption(null);
          router.push(`/projects/${projectId}`);
        }}
      />
    </>
  );
};

export default TaskMoreMenu;
