import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db
      .query('tasks')
      .withIndex('by_owner', (q) => q.eq('owner', userId || undefined))
      .collect();
  },
});

export const toggleCompleted = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    if (!task) {
      throw new Error('Task not found');
    }
    await ctx.db.patch(id, { isCompleted: !task.isCompleted });
  },
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const userId = await getAuthUserId(ctx);
    if (text.length === 0) {
      throw new Error('Task text cannot be empty');
    }
    const task = {
      text,
      owner: userId || undefined,
      isCompleted: false,
    };
    return await ctx.db.insert('tasks', task);
  },
});

export const deleteTask = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    if (!task) {
      throw new Error('Task not found');
    }
    await ctx.db.delete(id);
  },
});
