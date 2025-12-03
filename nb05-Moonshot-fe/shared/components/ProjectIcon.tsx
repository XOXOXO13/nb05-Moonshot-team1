import classNames from "classnames/bind";
import FolderImage from "@/public/assets/folder.svg";
import { simpleHash } from "@/nb05-Moonshot-fe/shared/utils";
import styles from "./ProjectIcon.module.css";

const cx = classNames.bind(styles);

const COLOR_STYLES = [styles.blue, styles.pink, styles.purple];
const getColorStyle = (key: string) => {
  return COLOR_STYLES[simpleHash(key, COLOR_STYLES.length)];
};

const ProjectIcon = ({
  className,
  projectId,
  name,
}: {
  className?: string;
  projectId: number;
  name: string;
}) => {
  const colorStyle = getColorStyle(`${projectId}-${name}`);
  return (
    <FolderImage className={cx(styles.projectIcon, colorStyle, className)} />
  );
};

export default ProjectIcon;
