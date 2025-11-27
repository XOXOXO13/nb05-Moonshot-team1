export class UserDto {
  private readonly id?: number;
  private readonly name: string;
  private readonly email: string;
  private readonly profileImage: string | null;

  constructor(data: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.profileImage = data.profileImage;
  }
}
