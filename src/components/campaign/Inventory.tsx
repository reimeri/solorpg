import { useConvexQuery } from '@convex-dev/react-query';
import type { Id } from 'convex/_generated/dataModel';
import { LucideSword } from 'lucide-react';
import { api } from '../../../convex/_generated/api';

function InventorySkeleton() {
  return (
    <div className="flex h-full max-h-1/3 w-full items-center justify-center rounded-xl bg-slate-50 shadow-md">
      <p>Loading inventory...</p>
    </div>
  );
}

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

export function Inventory(props: InventoryProps) {
  const campaign = props.campaign;

  if (!campaign) {
    return <InventorySkeleton />;
  }

  const inventoryItems = useConvexQuery(api.inventoryItems.get, {
    campaignId: campaign?._id,
  });

  if (!inventoryItems) {
    return <InventorySkeleton />;
  }

  return (
    <div className="flex h-full max-h-1/3 w-full flex-col gap-2 rounded-xl bg-slate-50 p-2 shadow-md">
      {inventoryItems.map((item) => (
        <>
          <div
            className="flex items-center rounded-lg bg-neutral-200 p-3"
            key={item._id}
          >
            {item.name}
            <LucideSword className="ml-auto inline-block h-10 w-10" />
          </div>
          <div className=" rounded-lg bg-neutral-200 p-3" key={item._id}>
            {item.name}
          </div>
          <div className=" rounded-lg bg-neutral-200 p-3" key={item._id}>
            {item.name}
          </div>
        </>
      ))}
    </div>
  );
}
