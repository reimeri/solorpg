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

  const item =
    !slot.equippedItemId === true
      ? undefined
      : useConvexQuery(api.inventoryItems.getById, {
          id: slot.equippedItemId,
        });

  return (
    <button
      className={`z-10 flex select-none flex-col items-center justify-center rounded-lg bg-neutral-200 p-2 text-center ${
        slot.enabled ? 'cursor-pointer hover:bg-neutral-300' : 'opacity-50'
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
                }
              );
              setExpandedInventory(true);
            }
          : undefined
      }
      type="button"
    >
      {slot.equippedItemId && (
        <span className="my-auto overflow-hidden text-ellipsis text-gray-600 text-xs">
          {item?.name || 'Loading...'}
        </span>
      )}
      <span className="font-semibold text-sm">{slot.name}</span>
    </button>
  );
}
