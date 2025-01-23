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
  GRAPHICS = "graphics",
}

interface IRoute {
  route: ROUTES;
  icon: string;
}

export const protectedRoutes: IRoute[] = [
  { route: ROUTES.STORES, icon: "domain" },
  { route: ROUTES.PRODUCTS, icon: "" },
  { route: ROUTES.CART, icon: "" },
  { route: ROUTES.ORDERS, icon: "" },
  { route: ROUTES.REPORTS, icon: "" },
  { route: ROUTES.GRAPHICS, icon: "" },
  { route: ROUTES.SETTINGS, icon: "" },
];

export const unprotectedRoutes: ROUTES[] = [
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
];
