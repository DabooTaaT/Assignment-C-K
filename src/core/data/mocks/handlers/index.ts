import { authHandlers } from "./auth";
import { homeHandlers } from "./home";
import { enhanceHtmlAssignmentHandlers } from "./enhanceHtmlAssignment";

export const handlers = [...authHandlers, ...homeHandlers, ...enhanceHtmlAssignmentHandlers];
