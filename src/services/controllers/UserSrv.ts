import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { hashSync, compareSync } from "bcryptjs";
import ShortUniqueId from "short-unique-id";

import { Api, GenericResponse } from "../../classes/Api";
import { createUser, updateUser } from "../redux/slices/users";
import { selectStore, setUser } from "../redux/slices/user";
import store from "../redux/store";
import { GenericError } from "../../classes/GenericError";
import emailSrv from "../email";

const saltRound = 10;

export class UsersSrv extends Api {
  endpoint?: string;
  dispatch: Dispatch<UnknownAction>;

  constructor(dispatch: Dispatch<UnknownAction>, endpoint?: string) {
    super();
    this.endpoint = endpoint;
    this.dispatch = dispatch;
  }

  addOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
  >(payload: T): GenericResponse<void> {
    const user = payload as Types.IUserDocument;
    const users = store.getState().users || [];
    const existingUser = users.find((_user) => _user.email === user.email);
    if (existingUser) {
      const error = new GenericError("User already exist");
      return { error };
    }
    const password = hashSync(user.password, saltRound);
    const username = user.email.split("@")[0];
    const data: Types.IUserDocument = {
      _id: user._id,
      email: user.email,
      password,
      profile: {
        ...user.profile,
        username,
      },
    };
    this.dispatch(createUser({ data }));
    return { data: undefined, error: undefined };
  }

  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
  >(filters: any): GenericResponse<T> {
    const users = store.getState().users || [];
    let user: Types.IUserDocument | null = null;
    const { email, _id, password } = filters || {};
    const error = new GenericError("User does not exist");
    if (email && password) {
      user = users.find((user) => user.email === email) || null;
      const equal = user?.password
        ? compareSync(password, user.password || "")
        : false;
      if (!equal) {
        return { data: null, error };
      }
    } else if (_id) {
      user = users.find((user) => user._id === _id) || null;
    } else {
      return { data: null, error };
    }
    return { data: user as unknown as T };
  }

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): GenericResponse<Types.IUserDocument> {
    const { error, data } = this.getOne({ email, password });
    if (data) {
      this.dispatch(setUser({ data: data as Types.IUserDocument }));
      return { data: data as Types.IUserDocument };
    }
    return { error };
  }
  logout() {
    this.dispatch(setUser({ data: null }));
  }
  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    userId: string,
    payload: Partial<T>,
    updateCurrentUser = true
  ): GenericResponse<T> {
    const { error, data: _data } = this.getOne<Types.IUserDocument>({
      _id: userId,
    });
    if (error) {
      return { error };
    } else if (!_data) {
      const error = new GenericError("Invalid data");
      return { error };
    }
    this.dispatch(updateUser({ userId, payload }));
    const { error: _error, data } = this.getOne<Types.IUserDocument>({
      _id: userId,
    });
    if (data && updateCurrentUser) {
      this.dispatch(setUser({ data }));
    }
    return { error: _error, data: data as unknown as T };
  }
  updatePassword({
    userId,
    email,
    password,
    newPassword,
  }: {
    userId: string;
    email: string;
    password: string;
    newPassword: string;
  }): GenericResponse<Types.IUserDocument> {
    const { error } = this.getOne({ email, password });
    if (error) {
      return { error };
    }
    const hashPassword = hashSync(newPassword);
    return this.updateOne<Types.IUserDocument>(userId, {
      password: hashPassword,
    });
  }
  async recoverPassword({
    email,
  }: {
    email: string;
  }): Promise<GenericResponse<void>> {
    const users = store.getState().users || [];
    const user = users.find((user) => user.email === email);
    if (!user) {
      const error = new GenericError("No user found");
      return { error };
    }
    try {
      //@ts-ignore
      const uid = new ShortUniqueId({ length: 10 });
      //@ts-ignore
      const plainPassword = uid.rnd();
      const hashPassword = hashSync(plainPassword, saltRound);
      const message = `Use this temporary password to log in to your account: ${plainPassword}`;
      await emailSrv.send({
        from_name: "My Inventory Manager",
        to_name: user.profile.username,
        to_email: user.email,
        message,
      });
      this.updateOne(user._id, { password: hashPassword }, false);
      return {};
    } catch (e) {
      const error = new GenericError("Could not send the email");
      return { error };
    }
  }
  deleteOne(id: string): GenericResponse<void> {
    return {};
  }
  selectStore(store: Types.IStoreDocument): void {
    this.dispatch(selectStore({ data: store }));
  }
}
