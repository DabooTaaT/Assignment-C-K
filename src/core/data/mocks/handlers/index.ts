import { authHandlers } from "./auth";
import { homeHandlers } from "./home";

export const handlers = [...authHandlers, ...homeHandlers];
