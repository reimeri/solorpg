import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const send = mutation({
  args: {
    content: v.string(),
    additionalInfo: v.string(),
    campaignId: v.id('campaigns'),
    characterId: v.id('characters'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Store user message
    const userMessageId = await ctx.db.insert('messages', {
      role: 'user' as const,
      content: args.content,
      timestamp: Date.now(),
      campaignId: args.campaignId,
      characterId: args.characterId,
      userId: identity.subject.split("|")[0] as Id<'users'>,
    });

    // Get the last few messages for context
    const recentMessages = await ctx.db
      .query('messages')
      .withIndex('by_campaign', (q) =>
        args.campaignId ? q.eq('campaignId', args.campaignId) : q
      )
      .order('desc')
      .collect();

    // Take only the last 10 messages
    const recentMessagesSlice = recentMessages.slice(0, 10);

    // Call AI service to get response
    await ctx.scheduler.runAfter(0, internal.ai.generateResponse, {
      messageId: userMessageId,
      additionalInfo: args.additionalInfo,
      contextMessages: recentMessagesSlice.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return { success: true };
  },
});

export const list = query({
  args: {
    campaignId: v.optional(v.id('campaigns')),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const res = ctx.db
      .query('messages')
      .withIndex('by_campaign', (q) =>
        args.campaignId ? q.eq('campaignId', args.campaignId) : q
      )
      .order('desc');

    if (args.limit) {
      return await res.take(args.limit);
    }

    return await res.collect();
  },
});
