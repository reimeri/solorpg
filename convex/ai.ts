import type { MessageContent } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { v } from 'convex/values';
import { api, internal } from './_generated/api';
import type { DataModel, Id } from './_generated/dataModel';
import { internalAction } from './_generated/server';

export const generateResponse = internalAction({
  args: {
    messageId: v.id('messages'),
    contextMessages: v.array(
      v.object({
        role: v.union(
          v.literal('user'),
          v.literal('assistant'),
          v.literal('system')
        ),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Get the message with proper type annotation
    const message: DataModel['messages']['document'] | null =
      await ctx.runQuery(api.messages.get, {
        id: args.messageId,
      });

    if (!message) {
      throw new Error('Message not found');
    }

    // Initialize the chat model with LiteLLM configuration
    const model = new ChatOpenAI({
      apiKey: process.env.LITELLM_API_KEY,
      configuration: {
        baseURL: process.env.LITELLM_API_URL,
      },
      modelName: 'gpt-5-mini',
      temperature: 0.7,
    });

    try {
      // Format messages for LangChain
      const formattedMessages = args.contextMessages.map((msg) => {
        if (msg.role === 'user') {
          return { role: 'human' as const, content: msg.content };
        }
        return { role: msg.role, content: msg.content };
      });

      // Get AI response
      const response = await model.invoke(formattedMessages);
      const aiResponse = response.content;

      // Store the AI response
      const responseId: DataModel['messages']['document']['_id'] | null =
        await ctx.runMutation(api.messages.insert, {
          role: 'assistant',
          content: aiResponse.toString(),
          timestamp: Date.now(),
          campaignId: message.campaignId,
          characterId: message.characterId,
          userId: message.userId as Id<'users'>,
        });

      const value: { id: Id<'messages'> | null; content: MessageContent } = {
        id: responseId,
        content: aiResponse,
      };

      return value;
    } catch (error) {
      throw new Error('Failed to generate AI response', { cause: error });
    }
  },
});
