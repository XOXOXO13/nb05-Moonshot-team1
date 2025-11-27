import { IInvitationRepository } from "./I-invitation-repository";
import { IMemberRepository } from "./I-member-repository";
import { IProjectRepository } from "./I-project-repository";
import { ITagRepository } from "./I-tag-repository";
import { ITaskRepository } from "./I-task-repository";
import { IUserRepository } from "./I-user-repository";

export interface IRepositories {
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
  tagRepository : ITagRepository;
  userRepository: IUserRepository;
  invitationRepository: IInvitationRepository;
  memberRepository: IMemberRepository;
}
