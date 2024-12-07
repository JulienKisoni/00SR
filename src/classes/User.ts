export class User implements Types.IUserDocument {
  _id = "";
  email = "";
  password = "";
  profile = {
    username: "",
    picture: "",
    role: Types.USER_ROLES.user,
  };

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
