import Link from "next/link";
import classNames from "classnames/bind";

import LogoImage from "@/public/assets/logo.svg";
import styles from "./GNB.module.css";
import ProjectList from "./ProjectList";
import Profile from "./Profile";
import NavLink from "@/shared/components/NavLink";
import { User, Project } from "@/nb05-Moonshot-team1/types/entities";

const cx = classNames.bind(styles);

const Divider = () => {
  return <hr className={cx("divider")} />;
};

const GNB = ({
  className,
  user,
  projects,
}: {
  className?: string;
  user: User;
  projects: Project[];
}) => {
  return (
    <nav className={cx("nav", className)}>
      <Link href="/">
        <LogoImage className={cx("logo")} />
      </Link>
      <Divider />
      <div className={cx("projectHeader")}>
        <Link className={cx("projectMenuLink")} href="/projects">
          프로젝트 목록
        </Link>
      </div>
      <ProjectList projects={projects} />
      <Divider />
      <NavLink
        className={cx("menuLink")}
        href="/tasks?view=calendar"
        activeClassName={cx("active")}
        activeCondition={{
          pathname: "/tasks",
          searchParams: {
            view: "calendar",
          },
        }}
      >
        캘린더 뷰
      </NavLink>
      <Divider />
      <NavLink
        className={cx("menuLink")}
        href="/tasks?view=board"
        activeClassName={cx("active")}
        activeCondition={{
          pathname: "/tasks",
          searchParams: {
            view: "board",
          },
        }}
      >
        칸반 뷰
      </NavLink>
      <Profile className={cx("profile")} user={user} />
    </nav>
  );
};

export default GNB;
