import { useConvexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { InventoryItem, LorebookEntry } from 'convex/schema';
import type { Id } from 'node_modules/convex/dist/esm-types/values/value';
import { createContext, useState } from 'react';
import type { Doc } from '~/../convex/_generated/dataModel';
import { CharacterStats } from '~/components/campaign/CharacterStats';
import { ChatMessageInput } from '~/components/campaign/ChatMessageInput';
import { ChatMessageWindow } from '~/components/campaign/ChatMessageWindow';
import { ExpandedInventory } from '~/components/campaign/ExpandedInventory';
import { Gear } from '~/components/campaign/Gear';
import { Inventory } from '~/components/campaign/Inventory';
import { InventoryItemEdit } from '~/components/campaign/InventoryItemEdit';
import { InventoryItemView } from '~/components/campaign/InventoryItemView';
import { Lorebook } from '~/components/campaign/Lorebook';
import { LorebookEntryEdit } from '~/components/campaign/LorebookEntryEdit';
import { LorebookEntryView } from '~/components/campaign/LorebookEntryView';
import { TOP_BAR_HEIGHT } from '~/components/TopBar';
import { api } from '../../../../convex/_generated/api';

export const Route = createFileRoute('/campaign/$campaignId/')({
  component: RouteComponent,
});

export const CampaignContext = createContext<{
  _id: Id<'campaigns'>;
  _creationTime: number;
  name: string;
  owner: Id<'users'>;
  description: string;
} | null>(null);

function RouteComponent() {
  const { campaignId } = Route.useParams();
  const campaign = useConvexQuery(api.campaigns.get, {
    campaignId: campaignId as Id<'campaigns'>,
  });
  const character = useConvexQuery(api.characters.get, {
    campaignId: campaignId as Id<'campaigns'>,
  });
  const [editedInventoryItem, setEditedInventoryItem] =
    useState<InventoryItem | null>(null);
  const [viewedInventoryItem, setViewedInventoryItem] =
    useState<Doc<'inventoryItems'> | null>(null);
  const [expandedInventory, setExpandedInventory] = useState(false);
  const [inventorySelectionFunction, setInventorySelectionFunction] = useState<
    ((item: Doc<'inventoryItems'>) => void) | undefined
  >(undefined);
  const [editedLorebookEntry, setEditedLorebookEntry] =
    useState<LorebookEntry | null>(null);
  const [viewedLorebookEntry, setViewedLorebookEntry] =
    useState<Doc<'LorebookEntries'> | null>(null);

  if (!(campaign && character)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const showMainContent =
    editedInventoryItem === null &&
    viewedInventoryItem === null &&
    !expandedInventory;

  const showLorebook =
    editedLorebookEntry === null && viewedLorebookEntry === null;

  return (
    <div
      className="flex w-full justify-center gap-4"
      style={{ height: `calc(100vh - ${TOP_BAR_HEIGHT}px)` }}
    >
      <CampaignContext value={campaign ?? null}>
        <div className="my-2 flex w-full max-w-[500px] flex-col gap-4">
          {editedInventoryItem && (
            <InventoryItemEdit
              inventoryItem={editedInventoryItem}
              setEditedInventoryItem={setEditedInventoryItem}
            />
          )}
          {viewedInventoryItem && (
            <InventoryItemView
              inventoryItem={viewedInventoryItem}
              setViewedInventoryItem={setViewedInventoryItem}
            />
          )}
          {expandedInventory && (
            <ExpandedInventory
              campaign={campaign}
              inventorySelectionFunction={inventorySelectionFunction}
              setEditedInventoryItem={setEditedInventoryItem}
              setExpandedInventory={setExpandedInventory}
              setInventorySelectionFunction={setInventorySelectionFunction}
              setViewedInventoryItem={setViewedInventoryItem}
            />
          )}
          {showMainContent && (
            <>
              <CharacterStats campaignId={campaign._id} />
              <Gear
                campaignId={campaign._id}
                setExpandedInventory={setExpandedInventory}
                setInventorySelectionFunction={setInventorySelectionFunction}
              />
              <Inventory
                campaign={campaign}
                setEditedInventoryItem={setEditedInventoryItem}
                setExpandedInventory={setExpandedInventory}
                setViewedInventoryItem={setViewedInventoryItem}
              />
            </>
          )}
        </div>
        <div className="my-2 flex w-full max-w-[1000px] flex-col gap-4">
          <ChatMessageWindow />
          <ChatMessageInput characterId={character._id} />
        </div>
        <div className="my-2 flex w-full max-w-[500px] flex-col">
          {editedLorebookEntry && (
            <LorebookEntryEdit
              lorebookEntry={editedLorebookEntry}
              setEditedLorebookEntry={setEditedLorebookEntry}
            />
          )}
          {viewedLorebookEntry && (
            <LorebookEntryView
              lorebookEntry={viewedLorebookEntry}
              setViewedLorebookEntry={setViewedLorebookEntry}
            />
          )}
          {showLorebook && (
            <Lorebook
              campaign={campaign}
              campaignId={campaign._id}
              setEditedLorebookEntry={setEditedLorebookEntry}
              setViewedLorebookEntry={setViewedLorebookEntry}
            />
          )}
        </div>
      </CampaignContext>
    </div>
  );
}
