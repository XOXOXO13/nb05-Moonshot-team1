"use client";

import classNames from "classnames/bind";
import { toast } from "react-toastify";
import styles from "./RemoveInvitation.module.css";
import { removeInvitation } from "../actions";
const cx = classNames.bind(styles);

const RemoveInvitation = ({
  projectId,
  invitationId,
}: {
  projectId: number;
  invitationId: string | null;
}) => {
  const handleClick = async () => {
    if (!invitationId) {
      toast.error("잘못된 요청입니다.");
      return;
    }

    const { error, success } = await removeInvitation(projectId, invitationId);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
  };

  return (
    <span className={cx("removeInvitation")} onClick={handleClick}>
      초대 취소
    </span>
  );
};

export default RemoveInvitation;
