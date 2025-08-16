import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { campaignFields } from './schema';

export const get = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, { campaignId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to fetch campaign');
    }

    return await ctx.db
      .query('campaigns')
      .withIndex('by_id', (q) => q.eq('_id', campaignId))
      .filter((q) => q.eq(q.field('owner'), userId))
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to list campaigns');
    }

    return await ctx.db
      .query('campaigns')
      .withIndex('by_owner', (q) => q.eq('owner', userId))
      .order('desc')
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    scenario: v.string(),
    firstMessage: v.string(),
    rules: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to create campaign');
    }

    const campaignId = await ctx.db.insert('campaigns', {
      name: args.name,
      scenario: args.scenario,
      firstMessage: args.firstMessage,
      rules: args.rules,
      owner: userId,
    });

    return campaignId;
  },
});

export const createWithCharacter = mutation({
  args: {
    campaign: v.object({
      name: v.string(),
      scenario: v.string(),
      firstMessage: v.string(),
      rules: v.string(),
    }),
    character: v.object({
      name: v.string(),
      description: v.string(),
      race: v.string(),
      level: v.number(),
      stats: v.object({
        strength: v.number(),
        agility: v.number(),
        constitution: v.number(),
        mind: v.number(),
        charisma: v.number(),
      }),
      equipmentSlots: v.array(
        v.object({
          name: v.string(),
          equippedItemId: v.optional(v.id('inventoryItems')),
          enabled: v.boolean(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to create campaign');
    }

    // Create campaign first
    const campaignId = await ctx.db.insert('campaigns', {
      name: args.campaign.name,
      scenario: args.campaign.scenario,
      firstMessage: args.campaign.firstMessage,
      rules: args.campaign.rules,
      owner: userId,
    });

    // Then create character for the campaign
    const characterId = await ctx.db.insert('characters', {
      name: args.character.name,
      description: args.character.description,
      race: args.character.race,
      owner: userId,
      campaignId,
      level: args.character.level,
      stats: args.character.stats,
      equipmentSlots: args.character.equipmentSlots,
    });

    return { campaignId, characterId };
  },
});

export const update = mutation({
  args: {
    campaignId: v.id('campaigns'),
    name: v.optional(v.string()),
    scenario: v.optional(v.string()),
    firstMessage: v.optional(v.string()),
    rules: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to update campaign');
    }

    const existingCampaign = await ctx.db.get(args.campaignId);
    if (!existingCampaign || existingCampaign.owner !== userId) {
      throw new Error('Campaign not found or access denied');
    }

    const updateFields: Partial<typeof campaignFields.type> = {};

    if (args.name !== undefined) {
      updateFields.name = args.name;
    }
    if (args.scenario !== undefined) {
      updateFields.scenario = args.scenario;
    }
    if (args.firstMessage !== undefined) {
      updateFields.firstMessage = args.firstMessage;
    }
    if (args.rules !== undefined) {
      updateFields.rules = args.rules;
    }

    await ctx.db.patch(args.campaignId, updateFields);

    return args.campaignId;
  },
});

export const remove = mutation({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, { campaignId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to delete campaign');
    }

    const existingCampaign = await ctx.db
      .query('campaigns')
      .withIndex('by_id', (q) => q.eq('_id', campaignId))
      .filter((q) => q.eq(q.field('owner'), userId))
      .first();

    if (!existingCampaign) {
      throw new Error('Campaign not found or access denied');
    }

    // Delete related data
    // Delete characters
    const characters = await ctx.db
      .query('characters')
      .withIndex('by_owner_and_campaign', (q) =>
        q.eq('owner', userId).eq('campaignId', campaignId)
      )
      .collect();

    await Promise.all(
      characters.map((character) => ctx.db.delete(character._id))
    );

    // Delete inventory items
    const inventoryItems = await ctx.db
      .query('inventoryItems')
      .withIndex('by_owner_and_campaign', (q) =>
        q.eq('owner', userId).eq('campaignId', campaignId)
      )
      .collect();

    await Promise.all(inventoryItems.map((item) => ctx.db.delete(item._id)));

    // Delete messages
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_campaign', (q) => q.eq('campaignId', campaignId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();

    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

    // Delete lorebook entries
    const lorebookEntries = await ctx.db
      .query('LorebookEntries')
      .withIndex('by_campaign_and_user', (q) =>
        q.eq('campaignId', campaignId).eq('userId', userId)
      )
      .collect();

    await Promise.all(lorebookEntries.map((entry) => ctx.db.delete(entry._id)));

    // Finally delete the campaign itself
    await ctx.db.delete(campaignId);

    return { success: true };
  },
});
