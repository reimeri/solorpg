import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { query } from './_generated/server';

export const get = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, { campaignId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('User must be authenticated to fetch inventory items');
    }

    return await ctx.db
      .query('campaigns')
      .withIndex('by_id', (q) => q.eq('_id', campaignId))
      .filter((q) => q.eq(q.field('owner'), userId))
      .first();
  },
});
