import StatusChip from "@/shared/components/StatusChip";
import {
  FlexTable,
  FlexTableCell,
  FlexTableHeader,
  FlexTableRow,
} from "../components/FlexTable";
import styles from "./page.module.css";
import classNames from "classnames/bind";
import ChevronRight from "@/public/assets/chevron-right.svg";
import Link from "next/link";
import { getTasksByProjectId } from "@/nb05-Moonshot-team1/app/(main)/action";
import Paginator from "../components/Paginator";
import { redirect } from "next/navigation";
import { TaskStatus } from "@/nb05-Moonshot-team1/types/TaskStatus";

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

const TaskListPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    page?: number;
    order_by?: "created_at" | "end_date" | "title";
    status?: TaskStatus;
    assignee?: number;
    keyword?: string;
  }>;
}) => {
  const { projectId: projectIdString } = await params;
  const { order_by, status, assignee, keyword, page } = await searchParams;
  const projectId = Number(projectIdString);
  if (isNaN(projectId)) {
    return redirect("/projects");
  }
  const { data } = await getTasksByProjectId(projectId, {
    page: page ?? 1,
    limit: PAGE_SIZE,
    order_by,
    status,
    assignee,
    keyword,
  });
  const tasks = data?.data ?? [];
  const total = data?.total ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <FlexTable>
        <FlexTableHeader>
          <FlexTableCell grow={1} base="100px">
            할 일
          </FlexTableCell>
          <FlexTableCell grow={0} base="100px">
            태그
          </FlexTableCell>
          <FlexTableCell grow={0} base="100px">
            담당자
          </FlexTableCell>
          <FlexTableCell grow={0} base="100px">
            상태
          </FlexTableCell>
          <FlexTableCell grow={0} base="100px">
            기한
          </FlexTableCell>
          <FlexTableCell grow={0} base="32px"></FlexTableCell>
        </FlexTableHeader>
        {tasks.map((task) => (
          <FlexTableRow key={task.id}>
            <FlexTableCell grow={1} base="100px">
              {task.title}
            </FlexTableCell>
            <FlexTableCell grow={0} base="100px">
              {task.tags.map((tag) => (
                <span className={cx("tag")} key={tag.id}>
                  #{tag.name}
                </span>
              ))}
            </FlexTableCell>
            <FlexTableCell grow={0} base="100px">
              {task.assignee?.name}
            </FlexTableCell>
            <FlexTableCell grow={0} base="100px">
              <StatusChip value={task.status} />
            </FlexTableCell>
            <FlexTableCell grow={0} base="100px">
              {`${task.endYear}-${task.endMonth}-${task.endDay}`}
            </FlexTableCell>
            <FlexTableCell grow={0} base="32px">
              <Link href={`/projects/${projectId}/tasks/${task.id}`}>
                <ChevronRight className={cx("chevronRight")} />
              </Link>
            </FlexTableCell>
          </FlexTableRow>
        ))}
      </FlexTable>
      <div className={cx("paginatorContainer")}>
        <Paginator total={pages} />
      </div>
    </>
  );
};

export default TaskListPage;
