/// <reference types="@convex-dev/experimental-langchain/server" />
/// <reference types="@convex-dev/experimental-langchain/anyApi" />
// TypeScript users only add this code
import type { DataModel } from "../dataModel";
import type { Document } from 'langchain/document';
import type { BaseMessage } from 'langchain/schema';

declare global {
  interface ConvexAPI extends APIFromModules<{
    "ai": typeof import("convex/ai");
    "http": typeof import("convex/http");
    "_generated/api": typeof import("../_generated/api");
    "_generated/dataModel": DataModel;
  }> {}
}
