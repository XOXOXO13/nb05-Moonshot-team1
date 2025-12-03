import { getTextFromChildren } from "@/nb05-Moonshot-fe/shared/utils";
import styles from "./FlexTable.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const FlexTableHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className={cx("header")}>{children}</div>;
};

const FlexTableRow = ({ children }: { children: React.ReactNode }) => {
  return <div className={cx("row")}>{children}</div>;
};

const FlexTableCell = ({
  grow,
  base,
  children,
  align = "left",
}: {
  grow: number;
  base?: string;
  children?: React.ReactNode;
  align?: "center" | "left" | "right";
}) => {
  const childrenText = getTextFromChildren(children);

  return (
    <div
      className={cx("cell", `align-${align}`)}
      style={{
        flexGrow: grow,
        flexBasis: base || "auto",
        flexShrink: grow > 0 ? 1 : 0,
      }}
      title={childrenText}
    >
      {children}
    </div>
  );
};

const FlexTable = ({ children }: { children: React.ReactNode }) => {
  return <div className={cx("table")}>{children}</div>;
};

export { FlexTableHeader, FlexTableRow, FlexTableCell, FlexTable };
