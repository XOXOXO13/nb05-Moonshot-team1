"use client";

import classNames from "classnames/bind";
import Link from "next/link";
import Image from "next/image";
import BlankProfile from "@/public/assets/blank-profile.svg";
import { User } from "@/nb05-Moonshot-team1/types/entities";
import styles from "./Profile.module.css";
import { Popover } from "react-tiny-popover";
import { useState } from "react";
import { logout } from "../action";

const cx = classNames.bind(styles);

const Profile = ({ className, user }: { className?: string; user: User }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      positions={["top", "left", "bottom", "right"]}
      padding={8}
      align="start"
      onClickOutside={() => setIsOpen(false)}
      content={
        <div className={cx(styles.menu)}>
          <Link
            href="/settings"
            className={cx(styles.menuItem)}
            onClick={() => setIsOpen(false)}
          >
            설정
          </Link>
          <div
            className={cx(styles.menuItem)}
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
          >
            로그아웃
          </div>
        </div>
      }
    >
      <div
        className={cx(styles.profile, className)}
        onClick={() => setIsOpen(true)}
      >
        {user.profileImage ? (
          <Image
            className={cx(styles.profileImage)}
            src={user.profileImage}
            alt="profile"
            width={32}
            height={32}
          />
        ) : (
          <BlankProfile className={cx(styles.profileImage)} />
        )}
        <span className={cx(styles.profileName)}>{user.name}</span>
      </div>
    </Popover>
  );
};

export default Profile;
