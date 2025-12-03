"use client";

import { useState } from "react";
import PopoverMenu from "@/shared/components/PopoverMenu";
import MoreVertical from "@/public/assets/more-vertical.svg";
import classNames from "classnames/bind";
import EditCommentModal from "./EditCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";
import styles from "./CommentMoreMenu.module.css";
import { Comment } from "@/nb05-Moonshot-team1/types/entities";

const cx = classNames.bind(styles);

const CommentMoreMenu = ({
  className,
  taskId,
  comment,
}: {
  className?: string;
  taskId: number;
  comment: Comment;
}) => {
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
      <EditCommentModal
        taskId={taskId}
        comment={comment}
        isOpen={selectedOption === "edit"}
        onClose={() => setSelectedOption(null)}
        onSubmit={() => setSelectedOption(null)}
      />
      <DeleteCommentModal
        taskId={taskId}
        commentId={comment.id}
        isOpen={selectedOption === "delete"}
        onClose={() => setSelectedOption(null)}
        onSubmit={() => setSelectedOption(null)}
      />
    </>
  );
};

export default CommentMoreMenu;
