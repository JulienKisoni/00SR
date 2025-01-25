import { v4 as uuidv4 } from "uuid";

enum USER_ROLES {
  user = "user",
  admin = "admin",
}
interface UserArgs {
  email: string;
  password: string;
  createdAt: string;
}

export class User implements Types.IUserDocument {
  _id = "";
  email = "";
  password = "";
  profile = {
    username: "",
    picture: "",
    role: "",
  };
  createdAt: string;

  constructor({ email, password, createdAt }: UserArgs) {
    this.email = email;
    this.password = password;
    this._id = uuidv4();
    this.profile.role = USER_ROLES.user;
    this.createdAt = createdAt;
  }
}
