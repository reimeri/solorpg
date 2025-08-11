import { DataModel } from "./dataModel";
import { GenericActionCtx } from "convex/server";
import { ActionBuilder } from "convex/browser";

type ActionCtx = GenericActionCtx<DataModel>;

declare module "../_generated/api" {
  interface APITypes {
    public: {
      query: {
        "chat:list": ActionBuilder<ActionCtx, "query", { campaignId?: string; limit?: number }, Promise<any[]>>;
      };
      mutation: {
        "chat:send": ActionBuilder<ActionCtx, "mutation", { content: string; campaignId?: string; characterId?: string }, Promise<{ success: boolean }>>;
      };
    };
  }
}
