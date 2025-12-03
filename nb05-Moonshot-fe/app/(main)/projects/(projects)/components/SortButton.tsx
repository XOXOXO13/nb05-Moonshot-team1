"use client";

import PopoverMenu from "@/nb05-Moonshot-fe/shared/components/PopoverMenu";
import SortIcon from "@/public/assets/sort.svg";
import { useRouter, useSearchParams } from "next/navigation";

const SortButton = () => {
  const router = useRouter();
  const params = useSearchParams();

  const handleSortChange = (value: "latest" | "name") => {
    const searchParams = new URLSearchParams(params);
    searchParams.set("sort", value);
    router.push(`?${searchParams.toString()}`);
  };

  const value = (params.get("sort") ?? "latest") as "latest" | "name";

  return (
    <PopoverMenu
      icon={<SortIcon />}
      options={[
        {
          label: "최신순",
          value: "latest",
        },
        {
          label: "이름순",
          value: "name",
        },
      ]}
      value={value}
      onChange={handleSortChange}
    />
  );
};

export default SortButton;
