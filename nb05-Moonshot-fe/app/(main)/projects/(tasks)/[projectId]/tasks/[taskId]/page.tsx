import classNames from "classnames/bind";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChevronRight from "@/assets/chevron-right.svg";
import SubTaskList from "./components/SubTaskList";
import CommentList from "./components/CommentList";
import MoreMenu from "./components/TaskMoreMenu";
import styles from "./page.module.css";
import {
  getCommentsByTaskId,
  getSubTasksByTaskId,
  getTaskById,
} from "./actions";
import { getProjectById } from "@/app/(main)/projects/actions";
import TaskDropdown from "./components/TaskDropdown";
import EditTaskAttachmentInput from "./components/EditTaskAttachmentInput";

const cx = classNames.bind(styles);

const TaskPage = async ({
  params,
}: {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}) => {
  const { projectId: projectIdString, taskId: taskIdString } = await params;
  const projectId = Number(projectIdString);
  const taskId = Number(taskIdString);
  const { data: project, error: projectError } =
    await getProjectById(projectId);
  const { data: task, error: taskError } = await getTaskById(taskId);

  if (projectError || taskError || !project || !task) {
    return redirect("/projects");
  }

  const { data: subTasks } = await getSubTasksByTaskId(taskId);
  const { data: comments } = await getCommentsByTaskId(taskId);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("breadcrumb")}>
        <Link className={cx("link")} href={`/projects/${projectId}`}>
          {project.name}
        </Link>
        <ChevronRight className={cx("chevron")} />
        <Link
          className={cx("link")}
          href={`/projects/${projectId}/tasks/${taskId}`}
        >
          {task.title}
        </Link>
      </div>
      <div className={cx("container")}>
        <div className={cx("header")}>
          <div className={cx("title")}>
            <h1 className={cx("titleText")}>{task.title}</h1>
            <TaskDropdown taskId={taskId} taskStatus={task.status} />
          </div>
          <div className={cx("metadata")}>
            <div className={cx("date")}>
              <span className={cx("dateValue")}>
                {[task.startYear, task.startMonth, task.startDay].join(".")} ~{" "}
                {[task.endYear, task.endMonth, task.endDay].join(".")}
              </span>
            </div>
            <div className={cx("verticalDivider")} />
            <div className={cx("assignee")}>{task.assignee?.name}</div>
          </div>
          <MoreMenu
            className={cx("moreMenu")}
            projectId={projectId}
            task={task}
          />
        </div>
        <div className={cx("horizontalDivider")} />
        <div>
          <p className={cx("description")}>{task.description}</p>
          <div className={cx("tags")}>
            {task.tags.map((tag) => (
              <span className={cx("tag")} key={tag.id}>
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
        <SubTaskList taskId={taskId} subTasks={subTasks ?? []} />
        <EditTaskAttachmentInput
          taskId={taskId}
          urls={task.attachments ?? []}
        />
        <div className={cx("horizontalDivider")} />
        <CommentList taskId={taskId} comments={comments ?? []} />
      </div>
    </div>
  );
};

export default TaskPage;
