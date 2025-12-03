"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import { Project } from "@/nb05-Moonshot-team1/types/entities";
import PopoverMenu from "@/nb05-Moonshot-fe/shared/components/PopoverMenu";
import MoreVertical from "@/public/assets/more-vertical.svg";
import styles from "../layout.module.css";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";

const cx = classNames.bind(styles);

const MoreMenu = ({
  className,
  project,
}: {
  className?: string;
  project: Project;
}) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    "edit" | "delete" | null
  >(null);

  return (
    <>
      <PopoverMenu
        className={cx(className)}
        icon={<MoreVertical className={cx("icon")} />}
        onChange={setSelectedOption}
        options={[
          {
            label: "수정",
            value: "edit",
          },
          {
            label: "삭제",
            value: "delete",
          },
        ]}
      />
      <EditProjectModal
        project={project}
        isOpen={selectedOption === "edit"}
        onClose={() => setSelectedOption(null)}
        onSubmit={() => setSelectedOption(null)}
      />
      <DeleteProjectModal
        projectId={project.id}
        isOpen={selectedOption === "delete"}
        onClose={() => setSelectedOption(null)}
        onSubmit={() => {
          setSelectedOption(null);
          router.push("/projects");
        }}
      />
    </>
  );
};

export default MoreMenu;
