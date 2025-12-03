import classNames from "classnames/bind";
import styles from "./layout.module.css";
import ChevronLeft from "@/assets/chevron-left.svg";
import ProjectIcon from "@/shared/components/ProjectIcon";
import MoreMenu from "./components/MoreMenu";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProjectTab from "./components/ProjectTab";
import { getProjectById } from "@/app/(main)/projects/actions";
import { Project } from "@/types/entities";
import { getProjectUsers } from "./members/actions";

const cx = classNames.bind(styles);

const ProjectLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
}) => {
  const { projectId: projectIdString } = await params;
  const projectId = Number(projectIdString);
  if (isNaN(projectId)) {
    return redirect("/projects");
  }

  let project: Project;
  try {
    const { error, data: projectData } = await getProjectById(projectId);
    if (error) {
      return redirect("/projects");
    }
    project = projectData!;
  } catch {
    return redirect("/projects");
  }

  const { data: paginationResponse } = await getProjectUsers(projectId, {
    page: 1,
    limit: 100,
  });
  const members = paginationResponse?.data ?? [];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("breadcrumb")}>
        <Link className={cx("link")} href="/projects">
          <ChevronLeft className={cx("chevron")} /> 목록으로
        </Link>
      </div>
      <div className={cx("container")}>
        <div className={cx("header")}>
          <ProjectIcon
            className={cx("projectIcon")}
            projectId={projectId}
            name={project!.name}
          />
          <h1 className={cx("title")}>{project!.name}</h1>
          <p className={cx("description")}>{project!.description}</p>
          <MoreMenu className={cx("moreMenu")} project={project} />
        </div>
        <ProjectTab projectId={projectId} members={members} />
        {children}
      </div>
    </div>
  );
};

export default ProjectLayout;
