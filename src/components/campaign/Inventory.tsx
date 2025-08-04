import { useConvexQuery } from '@convex-dev/react-query';
import type { Doc } from 'convex/_generated/dataModel';
import type { InventoryItem } from 'convex/schema';
import {
  LucideBook,
  LucideBox,
  LucideCarrot,
  LucideMinus,
  LucideShield,
  LucideStar,
  LucideSword,
} from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { SvgSpinners180RingWithBg } from '../icons/Spinner';

interface InventoryProps {
  campaign: Doc<'campaigns'>;
  setEditedInventoryItem: (item: InventoryItem | null) => void;
  setViewedInventoryItem: (item: Doc<'inventoryItems'> | null) => void;
}

function InventoryGridSkeleton() {
  return (
    <div className="flex h-full max-h-1/3 w-full items-center justify-center font-bold">
      <p>Loading inventory...</p>
      <SvgSpinners180RingWithBg className="ml-2 inline-block h-6 w-6" />
    </div>
  );
}

export function InventoryItemIcon(
  itemType:
    | 'weapon'
    | 'armor'
    | 'consumable'
    | 'document'
    | 'quest'
    | 'miscellaneous',
  size = 2.5
) {
  switch (itemType) {
    case 'weapon':
      return (
        <LucideSword
          className="ml-auto inline-block"
          style={{ height: `${size}rem`, width: `${size}rem` }}
        />
      );
    case 'armor':
      return (
        <LucideShield
          className="ml-auto inline-block"
          style={{ height: `${size}rem`, width: `${size}rem` }}
        />
      );
    case 'consumable':
      return (
        <LucideCarrot
          className="ml-auto inline-block"
          style={{ height: `${size}rem`, width: `${size}rem` }}
        />
      );
    case 'document':
      return (
        <LucideBook
          className="ml-auto inline-block"
          style={{ height: `${size}rem`, width: `${size}rem` }}
        />
      );
    case 'quest':
      return (
        <LucideStar
          className="ml-auto inline-block"
          style={{ height: `${size}rem`, width: `${size}rem` }}
        />
      );
    case 'miscellaneous':
      return (
        <LucideBox
          className="ml-auto inline-block"
          style={{ height: `${size}rem`, width: `${size}rem` }}
        />
      );
    default:
      return (
        <LucideMinus
          className="ml-auto inline-block"
          style={{ height: `${size}rem`, width: `${size}rem` }}
        />
      );
  }
}

function InventoryGrid(props: InventoryProps) {
  if (!props.campaign) {
    return <InventoryGridSkeleton />;
  }

  const inventoryItems = useConvexQuery(api.inventoryItems.get, {
    campaignId: props.campaign._id,
  });

  if (!inventoryItems) {
    return <InventoryGridSkeleton />;
  }

  return (
    <div className="h-0 min-h-0 w-full flex-1 overflow-y-auto p-2">
      <div className="grid grid-cols-2 gap-2">
        {inventoryItems.map((item) => (
          <button
            className="flex h-16 cursor-pointer items-center rounded-lg bg-neutral-200/60 p-3 hover:bg-neutral-200 active:bg-neutral-200/50"
            key={item._id}
            onClick={() => props.setViewedInventoryItem(item)}
            type="button"
          >
            <div className="w-3/4 overflow-hidden">
              <h2 className="select-none overflow-hidden text-ellipsis whitespace-nowrap text-start">
                {item.name}
              </h2>
              <h3 className="w-fit select-none text-gray-500 text-sm">
                {item.type}
              </h3>
            </div>
            {InventoryItemIcon(item.type)}
          </button>
        ))}
      </div>
    </div>
  );
}

function InventoryHeader(props: InventoryProps) {
  return (
    <div className="mb-1 flex items-center gap-2 rounded-t-xl p-2 shadow">
      <h1 className="font-bold text-lg">Inventory</h1>
      <button
        className="ml-auto cursor-pointer rounded-lg bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 active:bg-blue-700"
        onClick={() =>
          props.setEditedInventoryItem({
            name: '',
            description: '',
            owner: props.campaign.owner,
            campaignId: props.campaign._id,
            type: 'miscellaneous',
            count: 1,
            weight: 0,
            value: 0,
            damage: 0,
            tags: [],
          })
        }
        type="button"
      >
        Add Item
      </button>
    </div>
  );
}

export function Inventory(props: InventoryProps) {
  return (
    <div className="flex h-full max-h-1/3 w-full flex-col rounded-xl bg-slate-50 shadow-md">
      <InventoryHeader {...props} />
      <InventoryGrid {...props} />
    </div>
  );
}
