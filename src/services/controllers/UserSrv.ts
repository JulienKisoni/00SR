import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api } from "../../classes/Api";
import { createUser } from "../redux/slices/users";
import { setUser } from "../redux/slices/user";
import store from "../redux/store";

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

  getOne<T>(filters: any): T | null {
    const users = store.getState().users || [];
    let user: Types.IUserDocument | null = null;
    const { email, _id, password } = filters || {};
    if (email && password) {
      user =
        users.find(
          (user) => user.email === email && user.password === password
        ) || null;
    } else if (_id) {
      user = users.find((user) => user._id === _id) || null;
    } else {
      return null;
    }
    return user as unknown as T;
  }

  login(user: Types.IUserDocument): void {
    const data: Types.IUserDocument = {
      _id: user._id,
      email: user.email,
      password: user.password,
      profile: user.profile,
    };
    this.dispatch(setUser({ data }));
  }
}
