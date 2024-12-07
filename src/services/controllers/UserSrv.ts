import { Api } from "../../classes/Api";
import { createUser } from "../redux/slices/users";

export class UserSrv extends Api {
  endpoint?: string;

  constructor(_endpoint?: string) {
    super();
    this.endpoint = _endpoint;
  }

  addOne(user: Types.IUserDocument) {
    createUser({ data: user });
  }
}
