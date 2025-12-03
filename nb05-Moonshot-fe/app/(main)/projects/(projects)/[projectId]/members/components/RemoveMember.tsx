"use client";

import { useState } from "react";
import RemoveMemberModal from "./RemoveMemberModal";
import classNames from "classnames/bind";
import styles from "./RemoveMember.module.css";

const cx = classNames.bind(styles);

const RemoveMember = ({
  userId,
  projectId,
}: {
  userId: number;
  projectId: number;
}) => {
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);

  return (
    <>
      <span
        className={cx("removeMember")}
        onClick={() => setIsRemoveMemberModalOpen(true)}
      >
        제외하기
      </span>
      <RemoveMemberModal
        projectId={projectId}
        userId={userId}
        isOpen={isRemoveMemberModalOpen}
        onSubmit={() => {
          setIsRemoveMemberModalOpen(false);
        }}
        onClose={() => setIsRemoveMemberModalOpen(false)}
      />
    </>
  );
};

export default RemoveMember;
