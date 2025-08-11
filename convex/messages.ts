import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  args: { id: v.id('messages') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const insert = mutation({
  args: {
    role: v.union(
      v.literal('user'),
      v.literal('assistant'),
      v.literal('system')
    ),
    content: v.string(),
    timestamp: v.number(),
    campaignId: v.optional(v.id('campaigns')),
    characterId: v.optional(v.id('characters')),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', {
      role: args.role,
      content: args.content,
      timestamp: args.timestamp,
      campaignId: args.campaignId,
      characterId: args.characterId,
      userId: args.userId,
    });
  },
});
