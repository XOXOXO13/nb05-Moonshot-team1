import { TaskStatus } from "@/types/TaskStatus";
import styles from "./StatusChip.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const LABEL_MAP = {
  [TaskStatus.todo]: "진행 전",
  [TaskStatus.inProgress]: "진행 중",
  [TaskStatus.done]: "완료",
};

const STATUS_COLOR_MAP = {
  [TaskStatus.todo]: "todo",
  [TaskStatus.inProgress]: "in_progress",
  [TaskStatus.done]: "done",
};

const StatusChip = ({ value }: { value: TaskStatus }) => {
  return (
    <div className={cx("chip", `status-${STATUS_COLOR_MAP[value]}`)}>
      {LABEL_MAP[value]}
    </div>
  );
};

export default StatusChip;
