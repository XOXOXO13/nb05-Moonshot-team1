import { IEmailService } from "../../inbound/ports/services/I-email-service";
import * as nodemailer from "nodemailer";

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  private readonly fromEmail: string;

  constructor(smtpConfig: nodemailer.TransportOptions, fromEmail: string) {
    this.transporter = nodemailer.createTransport(smtpConfig);
    this.fromEmail = fromEmail;
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("이메일 서비스 연결 성공");
    } catch (error) {
      console.error("이메일 서비스 연결 실패", error);
    }
  }
  async sendInvitation(
    email: string,
    invitationLink: string,
    projectName: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: `[${projectName}] 프로젝트 초대장이 도착했습니다 !`,
      html: `
        <div>
        <p>아래 링크를 클릭하여 초대를 수락하고 프로젝트에 참여해 주세요.</p>
        <p>초대장은 7일동안 유효합니다.</p>
        </div> `,
      text: `[${projectName}] 프로젝트에 초대되었습니다. 초대를 수락하려면 다음 링크를 클릭하세요: ${invitationLink}`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`초대 이메일 전송 완료 : ${email} -> ${info.messageId}`);
    } catch (error) {
      console.error(`초대 이메일 전송 실패 : ${email} -> `, error);
      throw new Error();
    }
  }
}
