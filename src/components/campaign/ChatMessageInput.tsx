import { useConvexQuery } from '@convex-dev/react-query';
import { useParams } from '@tanstack/react-router';
import { useMutation } from 'convex/react';
import type { Character, InventoryItem } from 'convex/schema';
import { useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';

function generateGearAndInventoryInfoTo(
  character: Character & { _id: Id<'characters'>; _creationTime: number },
  inventory: (InventoryItem & {
    _id: Id<'inventoryItems'>;
    _creationTime: number;
  })[]
) {
  const gear = character?.equipmentSlots
    .filter((slot) => slot.enabled && slot.equippedItemId)
    .map((slot) => {
      const item = inventory?.find((i) => i._id === slot.equippedItemId);
      const { _creationTime, ...timelessItem } = item || {};
      return {
        name: slot.name,
        equippedItemId: slot.equippedItemId,
        item: timelessItem,
      };
    });

  const items = inventory?.map((item) => {
    const { _creationTime, ...timelessItem } = item;
    return timelessItem;
  });

  const name = character?.name;

  return `## Additional information:\nUse this information if it is relevant to the conversation or actions happening.\n${name} is wearing: ${JSON.stringify(gear || [])}\n${name} has following items in their inventory: ${JSON.stringify(items || [])}`;
}

export function ChatMessageInput({
  characterId,
}: {
  characterId: Id<'characters'>;
}) {
  const [message, setMessage] = useState('');
  const { campaignId: rawCampaignId } = useParams({
    strict: false,
  });
  const campaignId = rawCampaignId as Id<'campaigns'>;
  const sendMessage = useMutation(api.chat.send);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const character = useConvexQuery(api.characters.get, {
    campaignId,
  });
  const inventory = useConvexQuery(api.inventoryItems.get, {
    campaignId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) {
      return;
    }

    if (!(campaignId && characterId)) {
      setError('Campaign or character not found');
      return;
    }

    if (!(character && inventory)) {
      setError('Character or inventory data not loaded');
      return;
    }

    const additionalInfo = generateGearAndInventoryInfoTo(character, inventory);

    try {
      setError(null);
      setIsSending(true);
      await sendMessage({
        content: message,
        additionalInfo,
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
