import classNames from "classnames/bind";
import TaskFilter from "./components/TaskFilter";
import styles from "./page.module.css";
import BoardView from "./components/BoardView";
import CalendarView from "./components/CalendarView";
import { getMyProjectsWithCounts, getMyTasks } from "../action";
import { TaskStatus } from "@/types/TaskStatus";
import { FindMyTasksQuery } from "@/types/pagination";
import { getCurrentWeek } from "@/shared/utils";
import { getProjectUsers } from "../action";
import { UserWithCounts } from "@/types/entities";
const cx = classNames.bind(styles);

const MyTaskListPage = async ({
  searchParams,
}: {
  searchParams: Promise<
    {
      view?: string;
    } & FindMyTasksQuery
  >;
}) => {
  const { view, project_id, status, assignee_id, from, to, keyword } =
    await searchParams;
  const { data: projects } = await getMyProjectsWithCounts();
  let range: [number, number, number][] = [];
  if (view === "calendar") {
    const now = new Date();
    range = getCurrentWeek([
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getUTCDate(),
    ]);
  }
  const projectId = Number(project_id);
  const assigneeId = Number(assignee_id);

  const { data: taskResult } = await getMyTasks({
    project_id: Number.isNaN(projectId) ? undefined : projectId,
    status: (status as TaskStatus) ?? undefined,
    assignee_id: Number.isNaN(assigneeId) ? undefined : assigneeId,
    from: from ?? undefined,
    to: to ?? undefined,
    keyword: keyword ?? undefined,
  });
  const tasks = taskResult ?? [];

  let members: UserWithCounts[] = [];
  if (!Number.isNaN(projectId)) {
    const { data: membersResult } = await getProjectUsers(projectId, {
      page: 1,
      limit: 100,
    });
    members = membersResult?.data ?? [];
  }

  return (
    <div className={cx("container")}>
      <h1 className={cx("title")}>
        {view === "calendar" && "내 캘린더"}
        {view === "board" && "내 칸반"}
      </h1>
      <TaskFilter
        className={cx("filter")}
        projects={projects!}
        members={members}
      />
      {view === "calendar" && (
        <CalendarView className={cx("view")} tasks={tasks} range={range} />
      )}
      {view === "board" && <BoardView className={cx("view")} tasks={tasks} />}
    </div>
  );
};

export default MyTaskListPage;
