import { useConvexQuery } from '@convex-dev/react-query';
import type { Doc, Id } from 'convex/_generated/dataModel';
import type { Campaign, InventoryItem } from 'convex/schema';
import { LucideSword } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { SvgSpinners180RingWithBg } from '../icons/Spinner';

interface InventoryProps {
  campaign: Doc<'campaigns'>;
  setEditedInventoryItem: (item: InventoryItem | null) => void;
}

function InventoryGridSkeleton() {
  return (
    <div className="flex h-full max-h-1/3 w-full items-center justify-center font-bold">
      <p>Loading inventory...</p>
      <SvgSpinners180RingWithBg className="ml-2 inline-block h-6 w-6" />
    </div>
  );
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
    <div className="h-full w-full overflow-y-auto p-2">
      <div className="grid grid-cols-2 gap-2 ">
        {inventoryItems.map((item) => (
          <>
            <div
              className="flex h-16 cursor-pointer items-center rounded-lg bg-neutral-200/60 p-3 hover:bg-neutral-200 active:bg-neutral-200/50"
              key={item._id}
            >
              <div>
                <h2 className="select-none">{item.name}</h2>
                <h3 className="select-none text-gray-500 text-sm">
                  {item.type}
                </h3>
              </div>
              <LucideSword className="ml-auto inline-block h-10 w-10" />
            </div>
          </>
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
            type: 'misc',
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
    <div className="h-full max-h-1/3 w-full rounded-xl bg-slate-50 shadow-md">
      <InventoryHeader {...props} />
      <InventoryGrid {...props} />
    </div>
  );
}
