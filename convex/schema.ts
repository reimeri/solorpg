import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { type Infer, v } from 'convex/values';

export const campaignFields = v.object({
  name: v.string(),
  description: v.string(),
  owner: v.id('users'),
});
export type Campaign = Infer<typeof campaignFields>;
const campaigns = defineTable(campaignFields).index('by_owner', ['owner']);

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
    v.literal('misc')
  ),
  count: v.number(),
  weight: v.number(),
  value: v.number(),
  damage: v.number(),
  tags: v.array(v.string()),
});
export type InventoryItem = Infer<typeof inventoryItemFields>;
const inventoryItems = defineTable(inventoryItemFields).index(
  'by_owner_and_campaign',
  ['owner', 'campaignId']
);

export default defineSchema({
  ...authTables,
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    owner: v.optional(v.id('users')),
  }).index('by_owner', ['owner']),
  inventoryItems,
  campaigns,
});
