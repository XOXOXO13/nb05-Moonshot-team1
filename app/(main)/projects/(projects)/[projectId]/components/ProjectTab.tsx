"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames/bind";
import Input from "@/shared/components/Input";
import Dropdown from "@/shared/components/Dropdown";
import PopoverMenu from "@/shared/components/PopoverMenu";
import SortIcon from "@/public/assets/sort.svg";
import SearchIcon from "@/public/assets/search.svg";
import PlusIcon from "@/public/assets/plus.svg";
import styles from "./ProjectTab.module.css";
import CreateTaskModal from "./CreateTaskModal";
import MemberTabMenu from "./MemberTabMenu";
import { User } from "@/nb05-Moonshot-team1/types/entities";

const cx = classNames.bind(styles);

const TaskTabMenu = ({
  projectId,
  members,
}: {
  projectId: number;
  members: User[];
}) => {
  const params = useSearchParams();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

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
      searchParams.delete("assignee");
    } else {
      searchParams.set("assignee", value);
    }
    searchParams.delete("page");
    router.push(`?${searchParams.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const searchParams = new URLSearchParams(params);
    searchParams.set("order_by", value);
    searchParams.delete("page");
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className={cx("taskTabMenu")}>
      <PlusIcon
        className={cx("createTaskButton")}
        onClick={() => setIsCreateTaskOpen(true)}
      />
      <CreateTaskModal
        projectId={projectId}
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={() => setIsCreateTaskOpen(false)}
      />
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
      <PopoverMenu
        icon={<SortIcon />}
        options={[
          {
            label: "생성순",
            value: "created_at",
          },
          {
            label: "이름순",
            value: "title",
          },
          {
            label: "기한임박순",
            value: "end_date",
          },
        ]}
        value={params.get("order_by") || ""}
        onChange={handleSortChange}
      />
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
        value={params.get("assignee") || ""}
        onChange={handleAssigneeChange}
        placeholder="담당자"
      />
    </div>
  );
};

const ProjectTab = ({
  projectId,
  members,
}: {
  projectId: number;
  members: User[];
}) => {
  const pathname = usePathname();
  const currentTab: "tasks" | "members" = (() => {
    if (pathname === `/projects/${projectId}/tasks`) return "tasks";
    if (pathname === `/projects/${projectId}/members`) return "members";
    return "tasks";
  })();

  return (
    <div className={cx("container")}>
      <div className={cx("tabs")}>
        <Link
          className={cx("tab", { active: currentTab === "tasks" })}
          href={`/projects/${projectId}/tasks`}
        >
          할 일 목록
        </Link>
        <Link
          className={cx("tab", { active: currentTab === "members" })}
          href={`/projects/${projectId}/members`}
        >
          멤버 목록
        </Link>
      </div>
      <div>
        {currentTab === "tasks" && (
          <TaskTabMenu projectId={projectId} members={members} />
        )}
        {currentTab === "members" && <MemberTabMenu projectId={projectId} />}
      </div>
    </div>
  );
};

export default ProjectTab;
