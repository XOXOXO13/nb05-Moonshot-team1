export interface IEmailService {
  sendInvitation(
    email: string,
    invitationLink: string,
    projectName: string
  ): Promise<void>;
}
