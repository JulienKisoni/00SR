import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { Api } from "../../classes/Api";
import { createUser } from "../redux/slices/users";

export class UsersSrv extends Api {
  endpoint?: string;
  dispatch: Dispatch<UnknownAction>;

  constructor(dispatch: Dispatch<UnknownAction>, endpoint?: string) {
    super();
    this.endpoint = endpoint;
    this.dispatch = dispatch;
  }

  addOne(user: Types.IUserDocument) {
    const data: Types.IUserDocument = {
      _id: user._id,
      email: user.email,
      password: user.password,
      profile: user.profile,
    };
    this.dispatch(createUser({ data }));
  }
}
