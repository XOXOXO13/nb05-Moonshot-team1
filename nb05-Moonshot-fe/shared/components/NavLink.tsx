"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import cx from "classnames";

const NavLink = ({
  href,
  children,
  className,
  activeClassName,
  activeCondition,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  activeClassName: string;
  activeCondition: {
    pathname?: string;
    searchParams?: Record<string, string>;
    params?: Record<string, string>;
  };
}) => {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isActive = (() => {
    let result = true;

    if (activeCondition.pathname) {
      result &&= pathname.startsWith(activeCondition.pathname);
    }
    if (activeCondition.searchParams) {
      result &&= Object.keys(activeCondition.searchParams).every((key) => {
        return searchParams.get(key) === activeCondition.searchParams?.[key];
      });
    }
    if (activeCondition.params) {
      result &&= Object.keys(activeCondition.params).every((key) => {
        return params[key] === activeCondition.params?.[key];
      });
    }

    return result;
  })();

  return (
    <Link
      className={cx(className, { [activeClassName]: isActive })}
      href={href}
    >
      {children}
    </Link>
  );
};

export default NavLink;
