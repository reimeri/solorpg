import type { MessageContent } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { v } from 'convex/values';
import { api } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { internalAction } from './_generated/server';

export const generateResponse = internalAction({
  args: {
    messageId: v.id('messages'),
    additionalInfo: v.string(),
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
    const message = await ctx.runQuery(api.messages.get, {
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
      modelName: 'deepseek-v3-0324',
      temperature: 1,
    });

    try {
      // Format messages for LangChain
      const formattedMessages = args.contextMessages.map((msg) => {
        if (msg.role === 'user') {
          return { role: 'human' as const, content: msg.content };
        }
        return { role: msg.role, content: msg.content };
      });

      // Add system message to the end of the context
      formattedMessages.push({
        role: 'system',
        content: `You are a dungeon master for a solo RPG campaign.\n\nONLY use the following information if it is relevant to the conversation or actions happening.\n${args.additionalInfo}`,
      });

      // Get AI response
      const response = await model.invoke(formattedMessages.reverse());
      const aiResponse = response.content;

      // Store the AI response
      const responseId = await ctx.runMutation(api.messages.insert, {
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
