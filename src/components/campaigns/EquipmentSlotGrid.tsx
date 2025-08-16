import { useState } from 'react';
import type { Id } from '~/../convex/_generated/dataModel';

interface EquipmentSlot {
  name: string;
  enabled: boolean;
  equippedItemId?: Id<'inventoryItems'>;
}

interface EquipmentSlotGridProps {
  slots: EquipmentSlot[];
  onSlotsChange: (slots: EquipmentSlot[]) => void;
}

interface SlotEditModalProps {
  slot: EquipmentSlot;
  index: number;
  onSave: (index: number, slot: EquipmentSlot) => void;
  onClose: () => void;
}

function SlotEditModal({ slot, index, onSave, onClose }: SlotEditModalProps) {
  const [name, setName] = useState(slot.name);
  const [enabled, setEnabled] = useState(slot.enabled);

  const handleSave = () => {
    onSave(index, { ...slot, name, enabled });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">
          Edit Equipment Slot
        </h3>

        <div className="space-y-4">
          <div>
            <label
              className="block font-medium text-gray-700 text-sm"
              htmlFor="slotName"
            >
              Slot Name
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              id="slotName"
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., left hand, helmet, chest"
              type="text"
              value={name}
            />
          </div>

          <div className="flex items-center">
            <input
              checked={enabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              id="slotEnabled"
              onChange={(e) => setEnabled(e.target.checked)}
              type="checkbox"
            />
            <label className="ml-2 text-gray-700 text-sm" htmlFor="slotEnabled">
              Enable this equipment slot
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSave}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function EquipmentSlotGrid({
  slots,
  onSlotsChange,
}: EquipmentSlotGridProps) {
  const [editingSlot, setEditingSlot] = useState<{
    slot: EquipmentSlot;
    index: number;
  } | null>(null);

  const handleSlotClick = (slot: EquipmentSlot, index: number) => {
    setEditingSlot({ slot, index });
  };

  const handleSlotSave = (index: number, updatedSlot: EquipmentSlot) => {
    const newSlots = [...slots];
    newSlots[index] = updatedSlot;
    onSlotsChange(newSlots);
  };

  const getSlotDisplayName = (slot: EquipmentSlot) => {
    if (!slot.enabled) {
      return '';
    }
    return slot.name === 'air' ? '' : slot.name;
  };

  const getSlotClassName = (slot: EquipmentSlot) => {
    const baseClasses =
      'flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 text-xs font-medium transition-colors';

    if (!slot.enabled) {
      return `${baseClasses} border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-200`;
    }

    return `${baseClasses} border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100`;
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium text-gray-900 text-lg">Equipment Slots</h3>
        <p className="text-gray-600 text-sm">
          Click on any slot to enable/disable it or change its name. Enabled
          slots are highlighted in blue.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {slots.map((slot, index) => (
          <button
            className={getSlotClassName(slot)}
            key={`slot-${index}-${slot.name}`}
            onClick={() => handleSlotClick(slot, index)}
            type="button"
          >
            <span className="truncate">{getSlotDisplayName(slot)}</span>
          </button>
        ))}
      </div>

      {/* Cross lines like in the original Gear component */}
      <div className="relative mt-2">
        <div className="-translate-x-1/2 absolute top-0 left-1/2 h-2 w-px bg-gray-300" />
        <div className="-translate-y-1/2 absolute top-1/2 left-0 h-px w-full bg-gray-300" />
      </div>

      {editingSlot && (
        <SlotEditModal
          index={editingSlot.index}
          onClose={() => setEditingSlot(null)}
          onSave={handleSlotSave}
          slot={editingSlot.slot}
        />
      )}
    </div>
  );
}
