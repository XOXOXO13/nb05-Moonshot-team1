"use client";

import { useRef, useState } from "react";
import classNames from "classnames/bind";
import { toast } from "react-toastify";
import Image from "next/image";
import { uploadFiles } from "@/nb05-Moonshot-team1/app/actions";
import CloseButton from "@/public/assets/close-button.svg";
import BlankProfile from "@/public/assets/blank-profile.svg";
import styles from "./ImageInput.module.css";
import Button from "./Button";

const cx = classNames.bind(styles);

const ImageInput = ({
  className,
  url = null,
  onChange,
}: {
  className?: string;
  url: string | null;
  onChange: (url: string | null) => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const handleUploadFile = async (file: File) => {
    setIsPending(true);
    const { error, success, data } = await uploadFiles([file]);
    setIsPending(false);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }

    const nextUrl = data?.[0];
    if (nextUrl && typeof nextUrl === "string") {
      onChange(nextUrl);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length === 1) {
      handleUploadFile(files[0]);
    }
  };

  const handleFileClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      onChange(null);
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const isUploaded = !!url;
  const previewStyle = isUploaded ? { backgroundImage: `url(${url})` } : {};

  const handleRemoveClick = () => {
    handleFileClear();
  };

  return (
    <div
      className={cx("container", className, {
        preview: isUploaded,
        blank: !isUploaded,
      })}
      style={previewStyle}
    >
      <input
        disabled={isPending}
        type="file"
        className={cx("hiddenInput")}
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      {isUploaded ? (
        <>
          <Image
            src={url}
            alt="preview"
            className={cx("image")}
            width={80}
            height={80}
          />
          <CloseButton
            className={cx("removeButton")}
            width={20}
            height={20}
            onClick={handleRemoveClick}
          />
        </>
      ) : (
        <>
          <BlankProfile className={cx("image")} width={80} height={80} />
          <Button
            type="button"
            appearance="minimal"
            onClick={handleUploadClick}
          >
            이미지 첨부
          </Button>
        </>
      )}
    </div>
  );
};

export default ImageInput;
