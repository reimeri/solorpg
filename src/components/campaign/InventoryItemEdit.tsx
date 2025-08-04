import { useConvexMutation } from '@convex-dev/react-query';
import type { InventoryItem } from 'convex/schema';
import { api } from '~/../convex/_generated/api';
import type { Doc } from '~/../convex/_generated/dataModel';

interface InventoryItemEditProps {
  inventoryItem: InventoryItem;
  setEditedInventoryItem: (item: InventoryItem | null) => void;
}

export function InventoryItemEdit({
  inventoryItem,
  setEditedInventoryItem,
}: InventoryItemEditProps) {
  const storeInventoryItem = useConvexMutation(api.inventoryItems.create);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-slate-50 p-2 shadow-md">
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <h1 className="font-bold text-2xl">Edit Inventory Item</h1>
        <p className="text-gray-500">This feature is under construction.</p>
      </div>
      <div className="flex w-full items-center justify-center">
        <button
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={() => setEditedInventoryItem(null)}
          type="button"
        >
          Cancel
        </button>
        <button
          className="ml-auto rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => {
            // Logic to save the edited inventory item would go here
            storeInventoryItem({
              item: inventoryItem,
            });
            setEditedInventoryItem(null);
          }}
          type="button"
        >
          Save Item
        </button>
      </div>
    </div>
  );
}
