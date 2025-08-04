import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { inventoryItemFields } from './schema';

export const get = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, { campaignId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to fetch inventory items');
    }

    return await ctx.db
      .query('inventoryItems')
      .withIndex('by_owner_and_campaign', (q) =>
        q.eq('owner', userId).eq('campaignId', campaignId)
      )
      .collect();
  },
});

export const create = mutation({
  args: { item: inventoryItemFields },
  handler: async (ctx, { item }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User must be authenticated to create inventory items');
    }
    const inventoryItem = {
      ...item,
      owner: userId,
    };
    return await ctx.db.insert('inventoryItems', inventoryItem);
  },
});
