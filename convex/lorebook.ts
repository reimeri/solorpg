import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { query } from './_generated/server';

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
