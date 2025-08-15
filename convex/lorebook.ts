import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { lorebookEntryFields } from './schema';

export const get = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, { campaignId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to fetch lorebook entries');
    }

    return await ctx.db
      .query('LorebookEntries')
      .withIndex('by_campaign_and_user', (q) =>
        q.eq('campaignId', campaignId).eq('userId', userId)
      )
      .collect();
  },
});

export const getById = query({
  args: { id: v.id('LorebookEntries') },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to fetch lorebook entry');
    }

    const entry = await ctx.db.get(id);

    if (!entry) {
      return null;
    }

    // Verify the user owns this entry
    if (entry.userId !== userId) {
      throw new Error('User is not authorized to view this lorebook entry');
    }

    return entry;
  },
});

export const create = mutation({
  args: { entry: lorebookEntryFields },
  handler: async (ctx, { entry }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to create lorebook entries');
    }

    // Verify the user is the owner of the entry
    if (entry.userId !== userId) {
      throw new Error('User is not authorized to create this lorebook entry');
    }

    const entryWithTimestamp = {
      ...entry,
      updatedAt: Date.now(),
    };

    return await ctx.db.insert('LorebookEntries', entryWithTimestamp);
  },
});

export const update = mutation({
  args: {
    id: v.id('LorebookEntries'),
    entry: lorebookEntryFields,
  },
  handler: async (ctx, { id, entry }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to update lorebook entries');
    }

    const existingEntry = await ctx.db.get(id);

    if (!existingEntry) {
      throw new Error('Lorebook entry not found');
    }

    // Verify the user owns this entry
    if (existingEntry.userId !== userId) {
      throw new Error('User is not authorized to update this lorebook entry');
    }

    const entryWithTimestamp = {
      ...entry,
      updatedAt: Date.now(),
    };

    return await ctx.db.patch(id, entryWithTimestamp);
  },
});

export const remove = mutation({
  args: { id: v.id('LorebookEntries') },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to delete lorebook entries');
    }

    const entry = await ctx.db.get(id);

    if (!entry) {
      throw new Error('Lorebook entry not found');
    }

    // Verify the user owns this entry
    if (entry.userId !== userId) {
      throw new Error('User is not authorized to delete this lorebook entry');
    }

    return await ctx.db.delete(id);
  },
});
