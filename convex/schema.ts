import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const campaignFields = {
  name: v.string(),
  description: v.string(),
  owner: v.id('users'),
} as const;
const campaigns = defineTable(campaignFields).index('by_owner', ['owner']);

export const inventoryItemFields = {
  name: v.string(),
  description: v.string(),
  owner: v.id('users'),
  campaignId: v.id('campaigns'),
  type: v.union(
    v.literal('weapon'),
    v.literal('armor'),
    v.literal('consumable'),
    v.literal('Document'),
    v.literal('quest'),
    v.literal('misc')
  ),
  count: v.number(),
  weight: v.number(),
  value: v.number(),
  damage: v.number(),
  tags: v.array(v.string()),
} as const;

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
