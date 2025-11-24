import { IInvitationRepository } from "./repositories/I-invitation-repository";
import { IMemberRepository } from "./repositories/I-member-repository";
import { IProjectRepository } from "./repositories/I-project-repository";
import { ITaskRepository } from "./repositories/I-task-repository";
import { IUserRepository } from "./repositories/I-user-repository";

export interface IRepositories {
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
  userRepository: IUserRepository;
  invitationRepository: IInvitationRepository;
  memberRepository: IMemberRepository;
}
