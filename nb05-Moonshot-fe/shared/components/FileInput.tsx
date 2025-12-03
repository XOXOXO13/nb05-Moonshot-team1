"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import classNames from "classnames/bind";
import CloseButton from "@/public/assets/close-button.svg";
import { uploadFiles } from "@/nb05-Moonshot-team1/app/actions";
import styles from "./FileInput.module.css";

const cx = classNames.bind(styles);

const FileInput = ({
  urls = [],
  disabled = false,
  onChange = () => {},
}: {
  urls: string[];
  disabled?: boolean;
  onChange?: (urls: string[]) => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const handleFileUpload = async (newFiles: File[]) => {
    setIsPending(true);
    const { error, success, data } = await uploadFiles(newFiles);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
    if (data) {
      const nextUrl = [...urls, ...data];
      onChange(nextUrl);
    }
    setIsPending(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files || [];
    if (newFiles.length > 0) {
      handleFileUpload(Array.from(newFiles));
    }
  };

  const handleRemoveClick = (url: string) => {
    onChange(urls.filter((u) => u !== url));
  };

  return (
    <div className={cx("container")}>
      {urls.filter(Boolean).map((url) => (
        <div className={cx("file")} key={url}>
          <Link className={cx("link", "fileName")} href={url} target="_blank">
            {url.split("/").pop()}
          </Link>
          <CloseButton
            className={cx("closeIcon")}
            onClick={() => handleRemoveClick(url)}
          />
        </div>
      ))}
      <button
        className={cx("button")}
        type="button"
        onClick={handleButtonClick}
        disabled={isPending || disabled}
      >
        + 파일 첨부하기
      </button>
      <input
        type="file"
        hidden
        className={cx("input")}
        ref={inputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileInput;
