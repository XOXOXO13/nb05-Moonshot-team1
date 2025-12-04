export class AuthorVo {
    private _id: number;
    private _name: string;
    private _email: string;
    private _profileImage?: string;

    private constructor(params: {
        id: number;
        name: string;
        email: string;
        profileImage?: string;
    }) {
        this._id = params.id;
        this._name = params.name;
        this._email = params.email;
        this._profileImage = params.profileImage;
    }

    static createNew(params: {
        id: number;
        name: string;
        email: string;
        profileImage?: string;
    }) {
        return new AuthorVo({
            id: params.id,
            name: params.name,
            email: params.email,
            profileImage: params.profileImage
        })

    }
}

