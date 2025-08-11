import { useParams } from '@tanstack/react-router';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';

export function ChatMessageInput({
  characterId,
}: {
  characterId: Id<'characters'>;
}) {
  const [message, setMessage] = useState('');
  const { campaignId: rawCampaignId } = useParams({
    strict: false,
  });
  const campaignId = rawCampaignId as Id<'campaigns'> | undefined;
  const sendMessage = useMutation(api.chat.send);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) {
      return;
    }

    if (!(campaignId && characterId)) {
      setError('Campaign or character not found');
      return;
    }

    try {
      setError(null);
      setIsSending(true);
      await sendMessage({
        content: message,
        campaignId,
        characterId,
      });
      setMessage('');
    } catch (errorMsg) {
      setError(`Failed to send message. Please try again. ${errorMsg}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-slate-50 p-2 shadow-md">
      {error && (
        <div className="rounded-lg bg-red-100 p-2 text-red-700 text-sm">
          {error}
        </div>
      )}
      <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
        <input
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          disabled={isSending}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          type="text"
          value={message}
        />
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
          disabled={!message.trim() || isSending}
          type="submit"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
