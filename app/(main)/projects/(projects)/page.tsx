import classNames from "classnames/bind";
import ProjectIcon from "@/shared/components/ProjectIcon";
import styles from "./page.module.css";
import SortButton from "./components/SortButton";
import CreateProject from "./components/CreateProject";
import { ProjectWithCounts } from "@/nb05-Moonshot-team1/types/entities";
import Link from "next/link";
import { getMyProjectsWithCounts } from "./actions";
const cx = classNames.bind(styles);

const ProjectListItem = ({ project }: { project: ProjectWithCounts }) => {
  return (
    <div className={cx(styles.projectListItem)}>
      <div className={cx(styles.projectHeader)}>
        <ProjectIcon
          className={cx(styles.projectIcon)}
          projectId={project.id}
          name={project.name}
        />
        <div>
          <Link
            href={`/projects/${project.id}`}
            className={cx(styles.projectName)}
          >
            {project.name}
          </Link>
          <div className={cx(styles.projectMemberCount)}>
            {project.memberCount} 명
          </div>
        </div>
      </div>
      <div className={cx(styles.projectCounts)}>
        <div className={cx(styles.projectCount, styles.todo)}>
          <div className={cx(styles.projectCountLabel)}>진행 전</div>
          <span className={cx(styles.projectCountMetric)}>
            {project.todoCount}
          </span>
        </div>
        <div className={cx(styles.projectCount, styles.inProgress)}>
          <div className={cx(styles.projectCountLabel)}>진행 중</div>
          <span className={cx(styles.projectCountMetric)}>
            {project.inProgressCount}
          </span>
        </div>
        <div className={cx(styles.projectCount, styles.done)}>
          <div className={cx(styles.projectCountLabel)}>완료</div>
          <span className={cx(styles.projectCountMetric)}>
            {project.doneCount}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProjectList = ({ projects = [] }: { projects: ProjectWithCounts[] }) => {
  return (
    <div className={cx(styles.projectList)}>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
      <CreateProject />
    </div>
  );
};

const MyProjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    sort: "latest" | "name";
  }>;
}) => {
  const { sort } = await searchParams;
  const { data: projectsWithCounts } = await getMyProjectsWithCounts({
    sort,
  });

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <h1 className={cx(styles.title)}>프로젝트 목록</h1>
        <SortButton />
      </div>
      <ProjectList projects={projectsWithCounts ?? []} />
    </div>
  );
};

export default MyProjectListPage;
