export enum ROUTES {
  SIGNIN = "signin",
  SIGNUP = "signup",
  FORGOT_PASSWORD = "forgotpassword",
  STORES = "stores",
  PRODUCTS = "products",
  CART = "cart",
  ORDERS = "orders",
  REPORTS = "reports",
  SETTINGS = "settings",
}

export const protectedRoutes: ROUTES[] = [
  ROUTES.STORES,
  ROUTES.PRODUCTS,
  ROUTES.CART,
  ROUTES.ORDERS,
  ROUTES.REPORTS,
  ROUTES.SETTINGS,
];

export const unprotectedRoutes: ROUTES[] = [
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
];
