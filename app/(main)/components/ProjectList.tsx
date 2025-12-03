import classNames from "classnames/bind";
import styles from "./ProjectList.module.css";
import ProjectIcon from "@/shared/components/ProjectIcon";
import NavLink from "@/shared/components/NavLink";
import { Project } from "@/nb05-Moonshot-team1/types/entities";

const cx = classNames.bind(styles);

const ProjectListItem = ({
  projectId,
  name,
}: {
  projectId: number;
  name: string;
}) => {
  return (
    <NavLink
      className={cx("projectListItemLink")}
      href={`/projects/${projectId}`}
      activeClassName={cx("active")}
      activeCondition={{
        pathname: `/projects`,
        params: {
          projectId: projectId.toString(),
        },
      }}
    >
      <ProjectIcon
        className={cx("projectIcon")}
        projectId={projectId}
        name={name}
      />
      {name}
    </NavLink>
  );
};

const ProjectList = ({ projects }: { projects: Project[] }) => {
  return (
    <ul className={cx("projectList")}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectListItem projectId={project.id} name={project.name} />
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
