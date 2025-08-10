import { useConvexQuery } from '@convex-dev/react-query';
import { useMutation } from 'convex/react';
import { api } from '~/../convex/_generated/api';
import type { Doc, Id } from '~/../convex/_generated/dataModel';

interface GearSlotProps {
  slot: {
    equippedItemId?: Id<'inventoryItems'> | undefined;
    enabled: boolean;
    name: string;
  };
  characterId: Id<'characters'>;
  setExpandedInventory: (expanded: boolean) => void;
  setInventorySelectionFunction: (
    func: ((item: Doc<'inventoryItems'>) => void) | undefined
  ) => void;
}

function formatItemName(name: string): string {
  return name.length > 35 ? `${name.slice(0, 35)}...` : name;
}

export function GearSlot(props: GearSlotProps) {
  const {
    slot,
    characterId,
    setExpandedInventory,
    setInventorySelectionFunction,
  } = props;
  const setItemToSlot = useMutation(api.characters.setEquippedItem);

  if (!slot) {
    return <div className="text-gray-500">Loading...</div>;
  }

  const item = useConvexQuery(
    api.inventoryItems.getById,
    slot.equippedItemId ? { id: slot.equippedItemId } : 'skip'
  );

  return (
    <button
      className={`z-10 flex select-none flex-col items-center justify-center rounded-lg bg-neutral-200 p-2 text-center ${
        slot.enabled ? 'cursor-pointer hover:bg-neutral-300' : 'opacity-20'
      }`}
      onClick={
        slot.enabled
          ? () => {
              setInventorySelectionFunction(
                () => (i: Doc<'inventoryItems'>) => {
                  setItemToSlot({
                    characterId,
                    slotName: slot.name,
                    itemId: i._id,
                  });
                  setInventorySelectionFunction(undefined);
                }
              );
              setExpandedInventory(true);
            }
          : undefined
      }
      type="button"
    >
      <span className="my-auto overflow-hidden text-ellipsis font-semibold text-xs">
        {item ? formatItemName(item.name) : ''}
      </span>
      <span className="text-neutral-500 text-xs">
        {slot.name !== 'air' ? slot.name : ''}
      </span>
    </button>
  );
}
