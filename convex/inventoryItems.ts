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

export const getById = query({
  args: { id: v.id('inventoryItems') },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to fetch inventory items');
    }

    const item = await ctx.db.get(id);
    if (!item) {
      return null;
    }

    // Verify the item belongs to the user
    if (item.owner !== userId) {
      throw new Error('You can only view your own inventory items');
    }

    return item;
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

export const update = mutation({
  args: {
    id: v.id('inventoryItems'),
    item: inventoryItemFields,
  },
  handler: async (ctx, { id, item }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User must be authenticated to update inventory items');
    }

    // Verify the item belongs to the user
    const existingItem = await ctx.db.get(id);
    if (!existingItem) {
      throw new Error('Inventory item not found');
    }
    if (existingItem.owner !== userId) {
      throw new Error('You can only update your own inventory items');
    }

    const updatedItem = {
      ...item,
      owner: userId,
    };
    return await ctx.db.replace(id, updatedItem);
  },
});

export const remove = mutation({
  args: {
    id: v.id('inventoryItems'),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User must be authenticated to delete inventory items');
    }

    // Verify the item belongs to the user
    const existingItem = await ctx.db.get(id);
    if (!existingItem) {
      throw new Error('Inventory item not found');
    }
    if (existingItem.owner !== userId) {
      throw new Error('You can only delete your own inventory items');
    }

    return await ctx.db.delete(id);
  },
});
