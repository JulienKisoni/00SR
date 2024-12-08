import { v4 as uuidv4 } from "uuid";

enum USER_ROLES {
  user = "user",
  admin = "admin",
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

  constructor({ email, password }: { email: string; password: string }) {
    this.email = email;
    this.password = password;
    this._id = uuidv4();
    this.profile.role = USER_ROLES.user;
  }
}
