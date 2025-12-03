import classNames from "classnames/bind";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";
import * as api from "@/shared/api";
import "react-toastify/dist/ReactToastify.css";
import styles from "./layout.module.css";
import "../globals.css";
import { User } from "@/types/entities";

const cx = classNames.bind(styles);

export const metadata: Metadata = {
  title: "Moonshot",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: User | null = null;
  try {
    user = await api.getMe();
  } catch {
    user = null;
  }

  if (user) {
    redirect("/");
  }

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/spoqa-han-sans@3.3.0/css/SpoqaHanSansNeo.min.css"
        />
      </head>
      <body>
        <main className={cx("main")}>
          <div className={cx("container")}>{children}</div>
          <ToastContainer />
        </main>
      </body>
    </html>
  );
}
