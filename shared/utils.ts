import React, { ReactNode } from "react";

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return hours > 0
    ? `${hours}시간 ${minutes}분 ${seconds}초`
    : `${minutes}분 ${seconds}초`;
};

export const simpleHash = (str: string, n: number): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash % n;
};

export const getTextFromChildren = (children: ReactNode) => {
  let text = "";

  React.Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      text += child;
    } else if (React.isValidElement<{ children: ReactNode }>(child)) {
      text += getTextFromChildren(child.props.children);
    }
  });

  return text;
};

type Range = [number, number, number];

export const getCurrentWeek = (now: Range): Range[] => {
  const days: Range[] = [];
  const startDate = new Date(Date.UTC(now[0], now[1] - 1, now[2]));
  startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + i);
    days.push([d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()]);
  }
  return days;
};
