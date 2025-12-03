import {
  FlexTable,
  FlexTableCell,
  FlexTableHeader,
  FlexTableRow,
} from "../components/FlexTable";
import styles from "./page.module.css";
import classNames from "classnames/bind";
import { getProjectUsers } from "./actions";
import { UserWithCounts } from "@/nb05-Moonshot-team1/types/entities";
import Paginator from "../components/Paginator";
import RemoveMember from "./components/RemoveMember";
import UserProjectStatus from "@/nb05-Moonshot-team1/types/UserProjectStatus";
import RemoveInvitation from "./components/RemoveInvitation";

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

const MembersPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: number }>;
}) => {
  const { projectId: projectIdString } = await params;
  const { page } = await searchParams;
  const projectId = Number(projectIdString);
  const { data } = await getProjectUsers(projectId, {
    page: page ?? 1,
    limit: PAGE_SIZE,
  });
  const usersWithCounts: UserWithCounts[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <FlexTable>
        <FlexTableHeader>
          <FlexTableCell grow={1} base="80px">
            이름
          </FlexTableCell>
          <FlexTableCell grow={1} base="100px">
            이메일
          </FlexTableCell>
          <FlexTableCell grow={0} base="100px">
            작업 수
          </FlexTableCell>
          <FlexTableCell grow={0} base="140px"></FlexTableCell>
        </FlexTableHeader>
        {usersWithCounts.map((userWithCounts) => (
          <FlexTableRow key={userWithCounts.email}>
            <FlexTableCell grow={1} base="80px">
              {userWithCounts.name}
            </FlexTableCell>
            <FlexTableCell grow={1} base="100px">
              {userWithCounts.email}
            </FlexTableCell>
            <FlexTableCell grow={0} base="100px">
              {userWithCounts.taskCount}
            </FlexTableCell>
            <FlexTableCell grow={0} align="right" base="140px">
              {userWithCounts.status === UserProjectStatus.accepted ? (
                <RemoveMember
                  projectId={projectId}
                  userId={userWithCounts.id}
                />
              ) : (
                <div className={cx("invitationContainer")}>
                  <span>초대 중</span>
                  <RemoveInvitation
                    projectId={projectId}
                    invitationId={userWithCounts.invitationId}
                  />
                </div>
              )}
            </FlexTableCell>
          </FlexTableRow>
        ))}
      </FlexTable>
      <div className={cx("paginatorContainer")}>
        <Paginator total={pages} />
      </div>
    </>
  );
};

export default MembersPage;
