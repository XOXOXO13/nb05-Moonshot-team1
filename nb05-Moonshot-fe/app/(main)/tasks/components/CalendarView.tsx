import classNames from "classnames/bind";
import { Task } from "@/types/entities";
import styles from "./CalendarView.module.css";
import TaskItem from "./TaskItem";

const cx = classNames.bind(styles);

type Range = [number, number, number];

type TaskWithGrid = Task & { gridColumn: string; gridRow: number };

const filterTasks = (tasks: Task[], start: Range, end: Range) => {
  return tasks.filter((task) => {
    const taskStartDate = new Date(
      Date.UTC(task.startYear, task.startMonth - 1, task.startDay),
    );
    const rangeStartDate = new Date(Date.UTC(start[0], start[1] - 1, start[2]));
    const rangeEndDate = new Date(Date.UTC(end[0], end[1] - 1, end[2]));
    return taskStartDate >= rangeStartDate && taskStartDate <= rangeEndDate;
  });
};

const sortTasksByStartDay = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    if (a.startYear === b.startYear) {
      if (a.startMonth === b.startMonth) {
        if (a.startDay === b.startDay) {
          return a.id - b.id;
        }
        return a.startDay - b.startDay;
      }
      return a.startMonth - b.startMonth;
    }
    return a.startYear - b.startYear;
  });
};

const organizeTasksIntoRows = (tasks: Task[]): Task[][] => {
  const sortedTasks = sortTasksByStartDay(tasks);
  const rows: Task[][] = [[]];

  for (let i = 0; i < sortedTasks.length; i++) {
    const currentTask = sortedTasks[i];
    let isPushed = false;
    for (let j = 0; j < rows.length; j++) {
      const currentRow = rows[j];
      const currentRowEnd =
        currentRow.length > 0 ? currentRow[currentRow.length - 1] : null;
      if (currentRowEnd && currentTask.startDay > currentRowEnd.endDay) {
        rows[j].push(currentTask);
        isPushed = true;
        break;
      }
    }
    if (isPushed) {
      continue;
    }
    rows.push([currentTask]);
  }

  return rows;
};

const getGridColumn = (task: Task, start: Range, end: Range): string => {
  return `${task.startDay - start[2] + 1} / span ${Math.min(
    task.endDay - task.startDay + 1,
    end[2] - task.startDay + 1,
  )}`;
};

const getTaskWithGrid = (tasks: Task[], start: Range, end: Range) =>
  organizeTasksIntoRows(tasks).reduce<TaskWithGrid[]>(
    (acc, row, gridRow) =>
      acc.concat(
        row.map((task) => {
          return {
            ...task,
            gridRow,
            gridColumn: getGridColumn(task, start, end),
          };
        }),
      ),
    [],
  );

const CalendarView = ({
  className,
  tasks,
  range,
}: {
  className?: string;
  tasks: Task[];
  range: Range[];
}) => {
  const start = range[0];
  const end = range[6];
  const filteredTasks = filterTasks(tasks, start, end);
  const tasksWithGrid: TaskWithGrid[] = getTaskWithGrid(
    filteredTasks,
    start,
    end,
  );

  return (
    <div className={cx("container", className)}>
      <div className={cx("column")}>
        <div className={cx("header")}>
          월({range[0][1]}/{range[0][2]})
        </div>
      </div>
      <div className={cx("column")}>
        <div className={cx("header")}>
          화({range[1][1]}/{range[1][2]})
        </div>
      </div>
      <div className={cx("column")}>
        <div className={cx("header")}>
          수({range[2][1]}/{range[2][2]})
        </div>
      </div>
      <div className={cx("column")}>
        <div className={cx("header")}>
          목({range[3][1]}/{range[3][2]})
        </div>
      </div>
      <div className={cx("column")}>
        <div className={cx("header")}>
          금({range[4][1]}/{range[4][2]})
        </div>
      </div>
      <div className={cx("column")}>
        <div className={cx("header")}>
          토({range[5][1]}/{range[5][2]})
        </div>
      </div>
      <div className={cx("column")}>
        <div className={cx("header")}>
          일({range[6][1]}/{range[6][2]})
        </div>
      </div>
      <div className={cx("overlay")}>
        {tasksWithGrid.map((task) => (
          <TaskItem
            key={task.id}
            projectId={task.projectId}
            task={task}
            style={{ gridColumn: task.gridColumn, gridRow: task.gridRow }}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
