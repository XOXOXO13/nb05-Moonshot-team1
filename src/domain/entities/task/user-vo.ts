export class UserVo {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _email: string;
  private readonly _profileImage: string | null;

  constructor(params: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  }) {
    this._id = params.id;
    this._name = params.name;
    this._email = params.email;
    this._profileImage = params.profileImage;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get profileImage() {
    return this._profileImage;
  }
}
