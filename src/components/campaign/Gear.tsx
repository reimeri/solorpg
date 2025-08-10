import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '~/../convex/_generated/api';
import type { Doc, Id } from '~/../convex/_generated/dataModel';
import { GearSlot } from './GearSlot';

interface GearProps {
  campaignId: string;
  setExpandedInventory: (expanded: boolean) => void;
  setInventorySelectionFunction: (
    func: ((item: Doc<'inventoryItems'>) => void) | undefined
  ) => void;
}

export function Gear({
  campaignId,
  setExpandedInventory,
  setInventorySelectionFunction,
}: GearProps) {
  const character = useConvexQuery(api.characters.get, {
    campaignId: campaignId as Id<'campaigns'>,
  });

  return (
    <div className="relative grid h-full max-h-5/12 w-full grid-cols-5 grid-rows-5 gap-4 rounded-xl bg-slate-50 p-2 shadow-md">
      {character?.equipmentSlots.map((slot, index) => (
        <GearSlot
          characterId={character._id}
          key={slot.name + index}
          setExpandedInventory={setExpandedInventory}
          setInventorySelectionFunction={setInventorySelectionFunction}
          slot={slot}
        />
      ))}

      <div className="-translate-x-1/2 absolute bottom-2 left-1/2 h-[calc(100%-20px)] w-2 bg-black opacity-20" />
      <div className="-translate-y-1/2 absolute top-1/2 left-2 h-2 w-[calc(100%-20px)] bg-black opacity-20" />
    </div>
  );
}
