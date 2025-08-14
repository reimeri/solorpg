import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { type Infer, v } from 'convex/values';

/////////////////////////
// Campaign
/////////////////////////
export const campaignFields = v.object({
  name: v.string(),
  description: v.string(),
  owner: v.id('users'),
});
export type Campaign = Infer<typeof campaignFields>;
const campaigns = defineTable(campaignFields).index('by_owner', ['owner']);

/////////////////////////
// Inventory
/////////////////////////
export const inventoryItemFields = v.object({
  name: v.string(),
  description: v.string(),
  owner: v.id('users'),
  campaignId: v.id('campaigns'),
  type: v.union(
    v.literal('weapon'),
    v.literal('armor'),
    v.literal('consumable'),
    v.literal('document'),
    v.literal('quest'),
    v.literal('miscellaneous')
  ),
  count: v.number(),
  weight: v.number(),
  value: v.number(),
  damage: v.number(),
  defense: v.number(),
  tags: v.array(v.string()),
});
export type InventoryItem = Infer<typeof inventoryItemFields>;
const inventoryItems = defineTable(inventoryItemFields).index(
  'by_owner_and_campaign',
  ['owner', 'campaignId']
);

/////////////////////////
// Character
/////////////////////////
export const characterFields = v.object({
  name: v.string(),
  description: v.string(),
  race: v.string(),
  owner: v.id('users'),
  campaignId: v.id('campaigns'),
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
});
export type Character = Infer<typeof characterFields>;
const characters = defineTable(characterFields).index('by_owner_and_campaign', [
  'owner',
  'campaignId',
]);

// Messages table for chat
const messages = defineTable({
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
  linkedMessageId: v.optional(v.id('messages')),
})
  .index('by_campaign', ['campaignId'])
  .index('by_user', ['userId']).index('by_linked_message', ['linkedMessageId']);

export default defineSchema({
  ...authTables,
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    owner: v.optional(v.id('users')),
  }).index('by_owner', ['owner']),
  inventoryItems,
  campaigns,
  characters,
  messages,
});
