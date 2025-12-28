import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sessions", "routes/sessions.tsx"),
  route("set-locale", "routes/set-locale.tsx"),
] satisfies RouteConfig;
