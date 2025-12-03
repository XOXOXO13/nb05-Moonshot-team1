import * as nodemailer from "nodemailer";

export class Email{
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
      subject: `[${projectName}] 프로젝트 초대장이 도착했습니다!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: auto;">
          <h2 style="color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">
            ${projectName} 프로젝트 초대
          </h2>
          <p style="font-size: 16px; color: #333;">안녕하세요,</p>
          <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
            귀하를 <strong>${projectName}</strong> 프로젝트에 초대합니다.
            아래 버튼을 클릭하여 초대를 수락하고 프로젝트에 참여해 주세요.
          </p>
          
          <p style="text-align: center; margin-bottom: 30px;">
            <a href="${invitationLink}" 
               style="background-color: #1a73e8; color: white; padding: 12px 25px; text-align: center; text-decoration: none; 
                      display: inline-block; border-radius: 5px; font-weight: bold; font-size: 16px;">
              초대 수락하기
            </a>
          </p>

          <p style="font-size: 14px; color: #666;">
            * 초대장은 7일동안 유효합니다. 
          </p>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            <strong style="color: #333;">[참고]</strong> 링크가 작동하지 않을 경우, 아래 주소를 복사하여 브라우저에 붙여넣어 주세요:
            <br/>
            <span style="word-break: break-all;">${invitationLink}</span>
          </p>
        </div>
      `,
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
