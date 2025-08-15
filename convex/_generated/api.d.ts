/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as campaigns from "../campaigns.js";
import type * as characters from "../characters.js";
import type * as chat from "../chat.js";
import type * as http from "../http.js";
import type * as inventoryItems from "../inventoryItems.js";
import type * as lorebook from "../lorebook.js";
import type * as messages from "../messages.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  campaigns: typeof campaigns;
  characters: typeof characters;
  chat: typeof chat;
  http: typeof http;
  inventoryItems: typeof inventoryItems;
  lorebook: typeof lorebook;
  messages: typeof messages;
  tasks: typeof tasks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
