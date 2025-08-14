import type { MessageContent } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { v } from 'convex/values';
import { z } from 'zod';
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
          v.literal('system'),
          v.literal('toolcall')
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

    // Create the add inventory item tool
    const addInventoryItemTool = tool(
      async (input) => {
        try {
          if (!message.campaignId) {
            return 'Error: No campaign context available';
          }

          const itemId = await ctx.runMutation(
            api.inventoryItems.addItemForUser,
            {
              userId: message.userId as Id<'users'>,
              campaignId: message.campaignId,
              ...input,
            }
          );
          return `Successfully added "${input.name}" to inventory with ID: ${itemId}`;
        } catch (error) {
          return `Error adding item to inventory: ${error}`;
        }
      },
      {
        name: 'add_inventory_item',
        description:
          "Add an item to the user's inventory. Use this when you need to add item to users inventory. For example when the user picks up, receives, or finds an item in the story.",
        schema: z.object({
          name: z.string().describe('The name of the item'),
          description: z.string().describe('A description of the item'),
          type: z
            .enum([
              'weapon',
              'armor',
              'consumable',
              'document',
              'quest',
              'miscellaneous',
            ])
            .describe('The type/category of the item'),
          count: z
            .number()
            .optional()
            .default(1)
            .describe('How many of this item (defaults to 1)'),
          weight: z
            .number()
            .optional()
            .default(0)
            .describe('Weight of the item (defaults to 0)'),
          value: z
            .number()
            .optional()
            .default(0)
            .describe('Monetary value of the item (defaults to 0)'),
          damage: z
            .number()
            .optional()
            .default(0)
            .describe('Damage value for weapons (defaults to 0)'),
          defense: z
            .number()
            .optional()
            .default(0)
            .describe('Defense value for armor (defaults to 0)'),
          tags: z
            .array(z.string())
            .optional()
            .default([])
            .describe(
              'Array of tags to categorize the item (defaults to empty array)'
            ),
        }),
      }
    );

    // Initialize the chat model with LiteLLM configuration
    const model = new ChatOpenAI({
      apiKey: process.env.LITELLM_API_KEY,
      configuration: {
        baseURL: process.env.LITELLM_API_URL,
      },
      modelName: 'gpt-5-mini',
      temperature: 1,
    });

    // Bind the tool to the model
    const modelWithTools = model.bindTools([addInventoryItemTool]);

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
        content: `You are a dungeon master for a solo RPG campaign.

ONLY use the following information if it is relevant to the conversation or actions happening.
${args.additionalInfo}

IMPORTANT: You have access to an add_inventory_item tool. Use this tool whenever the user picks up, receives, or finds an item in the story. When using this tool:
- Set appropriate item properties based on what the item should be
- Use descriptive names and descriptions
- Set the type based on the item (weapon, armor, consumable, document, quest, miscellaneous)
- Set weight, value, damage, defense based on the item's properties
- Add relevant tags to help categorize the item
- The count defaults to 1 if not specified

Example usage: If the user finds a rusty sword, call the tool with properties like name: "Rusty Sword", type: "weapon", damage: 5, weight: 3, value: 10, tags: ["rusty", "one-handed"], etc.`,
      });

      // Get AI response
      const response = await modelWithTools.invoke(formattedMessages.reverse());

      const finalContent = response.content?.toString() || '';

      const latestUserMessage = await ctx.runQuery(api.messages.getLatestUserMessage, {
        userId: message.userId as Id<'users'>,
      });

      // Handle tool calls if any
      if (response.tool_calls && response.tool_calls.length > 0) {
        // Process tool calls in parallel
        const toolPromises = response.tool_calls
          .filter(toolCall => toolCall.name === 'add_inventory_item')
          .map(async (toolCall) => {
            try {
              // Parse and validate the arguments
              const toolArgs = toolCall.args as {
                name: string;
                description: string;
                type: 'weapon' | 'armor' | 'consumable' | 'document' | 'quest' | 'miscellaneous';
                count?: number;
                weight?: number;
                value?: number;
                damage?: number;
                defense?: number;
                tags?: string[];
              };

              const result = await addInventoryItemTool.invoke(toolArgs);

              // Store the toolcall result
              await ctx.runMutation(api.messages.insert, {
                role: 'toolcall',
                content: formatToolName(toolCall.name),
                timestamp: Date.now(),
                campaignId: message.campaignId,
                characterId: message.characterId,
                userId: message.userId as Id<'users'>,
                linkedMessageId: latestUserMessage?._id,
              });

              return `Tool executed: ${result}`;
            } catch (error) {
              return `Tool execution failed: ${error}`;
            }
          });

        await Promise.all(toolPromises);
      }

      // Store the AI response
      const responseId = await ctx.runMutation(api.messages.insert, {
        role: 'assistant',
        content: finalContent,
        timestamp: Date.now(),
        campaignId: message.campaignId,
        characterId: message.characterId,
        userId: message.userId as Id<'users'>,
      });

      const value: { id: Id<'messages'> | null; content: MessageContent } = {
        id: responseId,
        content: finalContent,
      };

      return value;
    } catch (error) {
      throw new Error('Failed to generate AI response', { cause: error });
    }
  },
});

function formatToolName(toolName: string): string {
  return toolName.charAt(0).toUpperCase() + toolName.slice(1).replaceAll('_', ' ');
}