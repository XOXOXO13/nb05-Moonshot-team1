"use client";

import classNames from "classnames/bind";
import styles from "./TaskFilter.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/shared/components/Input";
import Dropdown from "@/shared/components/Dropdown";
import SearchIcon from "@/assets/search.svg";
import ProjectIcon from "@/shared/components/ProjectIcon";
import { ProjectWithCounts } from "@/types/entities";
import { User } from "@/types/entities";
const cx = classNames.bind(styles);

const TaskFilter = ({
  className,
  projects,
  members,
}: {
  className?: string;
  projects: ProjectWithCounts[];
  members: User[];
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  const handleProjectChange = (id: number | null) => {
    const searchParams = new URLSearchParams(params);
    if (id) {
      searchParams.set("project_id", id.toString());
      searchParams.delete("assignee_id");
    } else {
      searchParams.delete("project_id");
      searchParams.delete("assignee_id");
    }
    searchParams.delete("page");
    router.push(`?${searchParams.toString()}`);
  };

  const handleSearch = (formData: FormData) => {
    const searchParams = new URLSearchParams(params);
    const keyword = formData.get("keyword");
    if (keyword) {
      searchParams.set("keyword", keyword as string);
    } else {
      searchParams.delete("keyword");
    }
    searchParams.delete("page");
    router.push(`?${searchParams.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    const searchParams = new URLSearchParams(params);
    if (value === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", value);
    }
    searchParams.delete("page");
    router.push(`?${searchParams.toString()}`);
  };
  const handleAssigneeChange = (value: string) => {
    const searchParams = new URLSearchParams(params);
    if (value === "all") {
      searchParams.delete("assignee_id");
    } else {
      searchParams.set("assignee_id", value);
    }
    searchParams.delete("page");
    router.push(`?${searchParams.toString()}`);
  };

  const isActiveProject = (id: number | null) => {
    return (
      params.get("project_id") === id?.toString() ||
      (id === null && !params.get("project_id"))
    );
  };

  return (
    <div className={cx("container", className)}>
      <div className={cx("tabs")}>
        <span
          className={cx("tab", { active: isActiveProject(null) })}
          onClick={() => handleProjectChange(null)}
        >
          전체
        </span>
        {projects.map((project) => (
          <div
            key={project.id}
            className={cx("tab", { active: isActiveProject(project.id) })}
            onClick={() => handleProjectChange(project.id)}
          >
            <ProjectIcon
              className={cx("projectIcon")}
              projectId={project.id}
              name={project.name}
            />
            <div>{project.name}</div>
          </div>
        ))}
      </div>
      <div className={cx("filters")}>
        <form className={cx("searchForm")} action={handleSearch}>
          {isSearchOpen ? (
            <Input
              search
              autoFocus
              name="keyword"
              className={cx("searchInput")}
              defaultValue={params.get("keyword") || ""}
              placeholder="이름으로 검색하기"
              onBlur={() => setIsSearchOpen(false)}
            />
          ) : (
            <SearchIcon
              className={cx("searchIcon")}
              onClick={() => {
                setIsSearchOpen(true);
              }}
            />
          )}
        </form>
        <Dropdown
          options={[
            { label: "전체", value: "all" },
            { label: "진행 전", value: "todo" },
            { label: "진행 중", value: "in_progress" },
            { label: "완료", value: "done" },
          ]}
          value={params.get("status") || ""}
          onChange={handleStatusChange}
          placeholder="상태"
        />
        <Dropdown
          className={cx("assigneeDropdown")}
          options={[
            { label: "전체", value: "all" },
            ...members.map((member) => ({
              label: member.name,
              value: member.id.toString(),
            })),
          ]}
          value={params.get("assignee_id") || ""}
          onChange={handleAssigneeChange}
          placeholder="담당자"
        />
      </div>
    </div>
  );
};

export default TaskFilter;
