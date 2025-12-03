"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Dropdown.module.css";
import ChevronDownIcon from "@/public/assets/chevron-down.svg";
const cx = classNames.bind(styles);

interface DropdownProps {
  className?: string;
  options: { value: string; label: string }[];
  value?: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Dropdown = ({
  className = "",
  options,
  value,
  placeholder,
  onChange,
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cx("dropdown")} ref={dropdownRef}>
      <div
        className={cx(
          "select",
          {
            open: isOpen,
          },
          className,
        )}
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <div className={cx("caret")}>
          <ChevronDownIcon />
        </div>
      </div>
      {isOpen && (
        <div className={cx("options")}>
          {options.map((option) => (
            <div
              key={option.value}
              className={cx("option", { active: option.value === value })}
              onClick={() => handleChange(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
