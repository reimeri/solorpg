import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { characterFields } from './schema';

const defaultEquipmentSlots = [
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'head' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'back' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'left hand' },
  { enabled: true, name: 'left arm' },
  { enabled: true, name: 'body' },
  { enabled: true, name: 'right arm' },
  { enabled: true, name: 'right hand' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'legs' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'feet' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
];

export const get = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, { campaignId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to fetch characters.');
    }

    return await ctx.db
      .query('characters')
      .withIndex('by_owner_and_campaign', (q) =>
        q.eq('owner', userId).eq('campaignId', campaignId)
      )
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    race: v.string(),
    campaignId: v.id('campaigns'),
    level: v.number(),
    stats: v.object({
      strength: v.number(),
      agility: v.number(),
      constitution: v.number(),
      mind: v.number(),
      charisma: v.number(),
    }),
    equipmentSlots: v.optional(
      v.array(
        v.object({
          name: v.string(),
          equippedItemId: v.optional(v.id('inventoryItems')),
          enabled: v.boolean(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to create characters');
    }

    const character = {
      name: args.name,
      description: args.description,
      race: args.race,
      owner: userId,
      campaignId: args.campaignId,
      level: args.level,
      stats: args.stats,
      equipmentSlots: args.equipmentSlots || defaultEquipmentSlots,
    };

    return await ctx.db.insert('characters', character);
  },
});

export const setEquippedItem = mutation({
  args: {
    characterId: v.id('characters'),
    slotName: v.string(),
    itemId: v.id('inventoryItems'),
  },
  handler: async (ctx, { characterId, slotName, itemId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to set equipped items.');
    }

    const character = await ctx.db.get(characterId);
    if (!character || character.owner !== userId) {
      throw new Error('Character not found or access denied.');
    }

    const updatedSlots = character.equipmentSlots.map((slot) => {
      // Remove item if already equipped
      if (slot.name === slotName && slot.equippedItemId === itemId) {
        return { ...slot, equippedItemId: undefined };
      }
      if (slot.name === slotName) {
        // If this is the target slot, equip the item
        return { ...slot, equippedItemId: itemId };
      }
      if (slot.equippedItemId === itemId) {
        // If this slot has the same item equipped, remove it
        return { ...slot, equippedItemId: undefined };
      }
      // Otherwise, leave the slot unchanged
      return slot;
    });

    return await ctx.db.patch(characterId, {
      equipmentSlots: updatedSlots,
    });
  },
});

export const updateCharacter = mutation({
  args: { characterId: v.id('characters'), fields: characterFields },
  handler: async (ctx, { characterId, fields }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to update characters.');
    }

    const character = await ctx.db.get(characterId);
    if (!character || character.owner !== userId) {
      throw new Error('Character not found or access denied.');
    }

    return await ctx.db.patch(characterId, {
      ...fields,
    });
  },
});
