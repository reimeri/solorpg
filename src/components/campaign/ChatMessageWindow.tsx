import { useParams } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';

type Message = {
  _id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
};

export function ChatMessageWindow() {
  const { campaignId: rawCampaignId } = useParams({ strict: false });
  const campaignId = rawCampaignId as Id<'campaigns'> | undefined;
  const messages = useQuery(api.chat.list, { campaignId }) as
    | Message[]
    | undefined;
  let sortedMessages = messages?.sort((a, b) => a.timestamp - b.timestamp);
  useEffect(() => {
    if (messages) {
      sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
    }
  }, [messages]);

  if (!messages) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50 p-2 shadow-md">
        <p className="text-slate-500">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50 p-2 shadow-md">
        <p className="text-slate-500">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto rounded-xl bg-slate-50 p-4 shadow-md">
      {sortedMessages?.map((message) => (
        <div
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          key={message._id}
        >
          <div
            className={`max-w-3/4 rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 text-slate-800'
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
            <div
              className={`mt-1 text-xs ${
                message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
