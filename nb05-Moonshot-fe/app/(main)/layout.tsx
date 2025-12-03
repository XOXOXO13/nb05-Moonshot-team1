import classNames from "classnames/bind";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GNB from "./components/GNB";
import styles from "./layout.module.css";
import "../globals.css";
import { getMe, getMyProjectsWithCounts } from "./action";

const cx = classNames.bind(styles);

export const metadata: Metadata = {
  title: "Moonshot",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { error: userError, data: user } = await getMe();
  if (userError) {
    redirect("/login");
  }

  const { data: projects } = await getMyProjectsWithCounts();

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/spoqa-han-sans@3.3.0/css/SpoqaHanSansNeo.min.css"
        />
      </head>
      <body className={cx(styles.body)}>
        <GNB className={cx(styles.nav)} user={user!} projects={projects!} />
        <main className={cx(styles.main)}>{children}</main>
        <div id="modal-root" />
        <ToastContainer />
      </body>
    </html>
  );
}
