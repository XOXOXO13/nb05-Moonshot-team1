"use client";

import { useState } from "react";
import { Popover } from "react-tiny-popover";
import classNames from "classnames/bind";
import styles from "./PopoverMenu.module.css";

const cx = classNames.bind(styles);

interface PopoverMenuOption<T> {
  label: string;
  value: T;
}

interface PopoverMenuProps<T> {
  className?: string;
  icon: React.ReactNode;
  options: PopoverMenuOption<T>[];
  value?: T;
  onChange: (value: T) => void;
}

const PopoverMenu = <T,>({
  className,
  value,
  icon,
  options: items,
  onChange,
}: PopoverMenuProps<T>) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom", "left", "top", "right"]}
      padding={8}
      align="end"
      onClickOutside={() => setIsPopoverOpen(false)}
      content={
        <div className={styles.menu}>
          {items.map((item) => (
            <div
              className={cx("menuItem", {
                active: value === item.value,
              })}
              key={item.label}
              onClick={() => {
                onChange(item.value);
                setIsPopoverOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      }
    >
      <div
        className={cx(
          "button",
          {
            active: isPopoverOpen,
          },
          className,
        )}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {icon}
      </div>
    </Popover>
  );
};

export default PopoverMenu;
