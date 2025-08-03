import { useConvexQuery } from '@convex-dev/react-query';
import type { Id } from 'convex/_generated/dataModel';
import { LucideSword } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { SvgSpinners180RingWithBg } from '../icons/Spinner';

interface InventoryProps {
  campaign:
    | {
        _id: Id<'campaigns'>;
        _creationTime: number;
        name: string;
        owner: Id<'users'>;
        description: string;
      }
    | undefined
    | null;
}

function InventoryGridSkeleton() {
  return (
    <div className="flex h-full max-h-1/3 w-full items-center justify-center font-bold">
      <p>Loading inventory...</p>
      <SvgSpinners180RingWithBg className="ml-2 inline-block h-6 w-6" />
    </div>
  );
}

function InventoryGrid({ campaign }: { campaign: InventoryProps['campaign'] }) {
  if (!campaign) {
    return <InventoryGridSkeleton />;
  }

  const inventoryItems = useConvexQuery(api.inventoryItems.get, {
    campaignId: campaign._id,
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

function InventoryHeader() {
  return (
    <div className="mb-1 flex items-center gap-2 rounded-t-xl p-2 shadow">
      <h1 className="font-bold text-lg">Inventory</h1>
      <button
        className="ml-auto cursor-pointer rounded-lg bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 active:bg-blue-700"
        type="button"
      >
        Add Item
      </button>
    </div>
  );
}

export function Inventory(props: InventoryProps) {
  const campaign = props.campaign;

  return (
    <div className="h-full max-h-1/3 w-full rounded-xl bg-slate-50 shadow-md">
      <InventoryHeader />
      <InventoryGrid campaign={campaign} />
    </div>
  );
}
