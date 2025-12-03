import classNames from "classnames/bind";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { getMe } from "../action";
import SettingsForm from "./components/SettingsForm";

const cx = classNames.bind(styles);

const SettingsPage = async () => {
  const { error, data } = await getMe();
  if (error) {
    redirect("/login");
  }

  const user = data!;

  return (
    <div className={cx("container")}>
      <div className={cx("card")}>
        <div className={cx("innerContainer")}>
          <SettingsForm user={user} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
