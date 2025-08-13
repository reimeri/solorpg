import { useParams } from '@tanstack/react-router';
import { useMutation, useQuery } from 'convex/react';
import { LucideEdit, LucideTrash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';
import { createLogger } from '~/lib/logger';

type Message = {
  _id: Id<'messages'>;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  userId: Id<'users'>;
};

export function ChatMessageWindow() {
  const { campaignId: rawCampaignId } = useParams({ strict: false });
  const campaignId = rawCampaignId as Id<'campaigns'> | undefined;
  const messages = useQuery(api.chat.list, { campaignId }) as
    | Message[]
    | undefined;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const updateMessage = useMutation(api.messages.updateMessage);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const logger = createLogger('ChatMessageWindow');
  let sortedMessages = messages?.sort((a, b) => a.timestamp - b.timestamp);
  useEffect(() => {
    if (messages) {
      sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
      // Scroll to bottom when messages change
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

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
          className={`group relative flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          key={message._id}
          ref={
            sortedMessages && message._id === sortedMessages.at(-1)?._id
              ? messagesEndRef
              : undefined
          }
        >
          <div
            className={`group/message relative max-w-3/4 rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 text-slate-800'
            }`}
          >
            {editingId === message._id ? (
              <div className="flex w-full flex-col gap-2">
                <div className="relative w-full">
                  <div
                    className="invisible whitespace-pre-wrap break-words p-2"
                    style={{
                      minHeight: '60px',
                      minWidth: '100%',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {`${editContent} `}
                  </div>
                  <textarea
                    autoFocus
                    className="absolute inset-0 w-full resize-none overflow-hidden rounded-lg border border-slate-300 bg-white p-2 text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        updateMessage({
                          id: message._id,
                          content: editContent,
                        })
                          .then(() => setEditingId(null))
                          .catch((error) => {
                            logger.error(
                              { error, messageId: message._id },
                              'Failed to update message'
                            );
                          });
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                      }
                    }}
                    rows={1}
                    style={{
                      minHeight: '100%',
                      maxHeight: '300px',
                      resize: 'none',
                    }}
                    value={editContent}
                  />
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    className="rounded-lg bg-slate-200 px-3 py-1.5 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setEditingId(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={!editContent.trim()}
                    onClick={async () => {
                      try {
                        await updateMessage({
                          id: message._id,
                          content: editContent,
                        });
                        setEditingId(null);
                      } catch (error) {
                        logger.error(
                          { error, messageId: message._id },
                          'Failed to update message'
                        );
                      }
                    }}
                    type="button"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                <div
                  className={`mt-1 flex items-center justify-between text-xs ${
                    message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  <span>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>

                  <div className="invisible flex items-center justify-center gap-1.5 group-hover/message:visible">
                    <button
                      aria-label="Edit message"
                      className="rounded-full p-1.5 transition-colors hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-500"
                      onClick={() => {
                        setEditingId(message._id);
                        setEditContent(message.content);
                      }}
                      title="Edit message"
                      type="button"
                    >
                      <LucideEdit size={14} />
                    </button>
                    <button
                      aria-label="Delete message"
                      className="rounded-full p-1.5 transition-colors hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-blue-500"
                      onClick={() => {
                        if (
                          confirm(
                            'Are you sure you want to delete this message?'
                          )
                        ) {
                          deleteMessage({ id: message._id }).catch(
                            logger.error
                          );
                        }
                      }}
                      title="Delete message"
                      type="button"
                    >
                      <LucideTrash size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
