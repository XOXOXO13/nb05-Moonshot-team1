import classNames from "classnames/bind";
import StatusChip from "@/shared/components/StatusChip";
import styles from "./TaskItem.module.css";
import { Task } from "@/types/entities";
import Link from "next/link";

const cx = classNames.bind(styles);

const TaskItem = ({
  className,
  task,
  style,
}: {
  className?: string;
  projectId: number;
  task: Task;
  style?: React.CSSProperties;
}) => {
  const startDate = `${task.startYear}.${task.startMonth}.${task.startDay}`;
  const endDate = `${task.endYear}.${task.endMonth}.${task.endDay}`;
  const assigneeName = task.assignee?.name;
  return (
    <div className={cx("task", className)} style={style}>
      <div className={cx("title")}>
        <Link
          className={cx("link")}
          href={`projects/${task.projectId}/tasks/${task.id}`}
        >
          {task.title}
        </Link>
        <StatusChip value={task.status} />
      </div>
      <div className={cx("metadata")}>
        <span className={cx("date")}>
          {startDate} ~ {endDate}
        </span>
        <div className={cx("divider")} />
        <span className={cx("assignee")} title={assigneeName}>
          {assigneeName}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
