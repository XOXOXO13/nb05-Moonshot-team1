"use client";

import ChevronLeft from "@/assets/chevron-left.svg";
import ChevronRight from "@/assets/chevron-right.svg";
import styles from "./Paginator.module.css";
import classNames from "classnames/bind";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const cx = classNames.bind(styles);

const MOD = 6;

interface PaginatorProps {
  total: number;
}

const Paginator = ({ total }: PaginatorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("page") || "1");

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  const start = Math.floor((current - 1) / MOD) * MOD + 1;
  const end = Math.min(start + MOD - 1, total);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const handlePageClick = (page: number) => {
    handlePageChange(page);
  };

  const handlePreviousClick = () => {
    handlePageChange(start - 1);
  };

  const handleNextClick = () => {
    handlePageChange(end + 1);
  };

  const isPreviousDisabled = start === 1;
  const isNextDisabled = end === total;

  return (
    <div className={cx("wrapper")}>
      <ChevronLeft
        className={cx("chevron", {
          inactive: isPreviousDisabled,
        })}
        onClick={isPreviousDisabled ? undefined : handlePreviousClick}
      />
      {pages.map((page) => (
        <div
          key={page}
          className={cx("page", { active: page === current })}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </div>
      ))}
      <ChevronRight
        className={cx("chevron", {
          inactive: isNextDisabled,
        })}
        onClick={isNextDisabled ? undefined : handleNextClick}
      />
    </div>
  );
};

export default Paginator;
