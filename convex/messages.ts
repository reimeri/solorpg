import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
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
      v.literal('system'),
      v.literal('toolcall')
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

export const deleteMessage = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    // Check if message exists
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error('Message not found');
    }

    // Delete the message
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const updateMessage = mutation({
  args: {
    id: v.id('messages'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if message exists
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error('Message not found');
    }

    // Update the message content
    await ctx.db.patch(args.id, {
      content: args.content,
    });

    return { success: true };
  },
});
