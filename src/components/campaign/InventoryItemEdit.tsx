import { useConvexMutation } from '@convex-dev/react-query';
import type { Id } from 'convex/_generated/dataModel';
import type { InventoryItem } from 'convex/schema';
import { useState } from 'react';
import { api } from '~/../convex/_generated/api';

interface InventoryItemEditProps {
  inventoryItem: InventoryItem;
  isEditing?: boolean;
  existingId?: Id<'inventoryItems'>;
  setEditedInventoryItem: (item: InventoryItem | null) => void;
}

function InventoryEditForm(props: InventoryItemEditProps) {
  const { inventoryItem, setEditedInventoryItem } = props;
  const [modifiedItem, setModifiedItem] =
    useState<InventoryItem>(inventoryItem);
  const [tagsInput, setTagsInput] = useState<string>(
    inventoryItem.tags.join(', ')
  );
  const [nameError, setNameError] = useState<string>('');

  const handleInputChange = (
    field: keyof InventoryItem,
    value: string | number
  ) => {
    // Clear name error when user starts typing in name field
    if (field === 'name' && nameError) {
      setNameError('');
    }

    setModifiedItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tagsArray = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setModifiedItem((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name field
    if (!modifiedItem.name || modifiedItem.name.trim() === '') {
      setNameError('Name is required');
      return;
    }

    // Return the modified item to parent component
    setEditedInventoryItem(modifiedItem);
  };

  return (
    <form className="h-full w-full" onSubmit={handleSubmit}>
      <div className="gap-4">
        <div className="mb-6 flex gap-2">
          <div className="w-full">
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className={`h-10 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${
                nameError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              id="name"
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              type="text"
              value={modifiedItem.name}
            />
            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}
          </div>

          <div className="w-full">
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="type"
            >
              Type
            </label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="type"
              onChange={(e) =>
                handleInputChange(
                  'type',
                  e.target.value as InventoryItem['type']
                )
              }
              value={modifiedItem.type}
            >
              <option value="weapon">Weapon</option>
              <option value="armor">Armor</option>
              <option value="consumable">Consumable</option>
              <option value="Document">Document</option>
              <option value="quest">Quest</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="count"
            >
              Count
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="count"
              min="0"
              onChange={(e) =>
                handleInputChange(
                  'count',
                  Number.parseInt(e.target.value, 10) || 0
                )
              }
              required
              type="number"
              value={modifiedItem.count}
            />
          </div>

          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="weight"
            >
              Weight
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="weight"
              min="0"
              onChange={(e) =>
                handleInputChange(
                  'weight',
                  Number.parseFloat(e.target.value) || 0
                )
              }
              required
              step="0.1"
              type="number"
              value={modifiedItem.weight}
            />
          </div>

          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="value"
            >
              Value
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="value"
              min="0"
              onChange={(e) =>
                handleInputChange(
                  'value',
                  Number.parseFloat(e.target.value) || 0
                )
              }
              required
              step="0.01"
              type="number"
              value={modifiedItem.value}
            />
          </div>

          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="damage"
            >
              Damage
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="damage"
              min="0"
              onChange={(e) =>
                handleInputChange(
                  'damage',
                  Number.parseFloat(e.target.value) || 0
                )
              }
              required
              step="0.1"
              type="number"
              value={modifiedItem.damage}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label
          className="mb-1 block font-medium text-gray-700 text-sm"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className="max-h-[50svh] min-h-[10svh] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="description"
          onChange={(e) => handleInputChange('description', e.target.value)}
          required
          rows={10}
          value={modifiedItem.description}
        />
      </div>

      <div className="mb-auto">
        <label
          className="mb-1 block font-medium text-gray-700 text-sm"
          htmlFor="tags"
        >
          Tags (comma-separated)
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="tags"
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="e.g. magical, rare, blessed"
          type="text"
          value={tagsInput}
        />
        {modifiedItem.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {modifiedItem.tags.map((tag) => (
              <span
                className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-800 text-xs"
                key={`tag-${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto flex justify-end space-x-2 pt-4">
        <button
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setEditedInventoryItem(null)}
          type="button"
        >
          Cancel
        </button>
        <button
          className="ml-auto rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export function InventoryItemEdit({
  inventoryItem,
  isEditing = false,
  existingId,
  setEditedInventoryItem,
}: InventoryItemEditProps) {
  const createInventoryItem = useConvexMutation(api.inventoryItems.create);
  const updateInventoryItem = useConvexMutation(api.inventoryItems.update);

  const handleSaveItem = async (modifiedItem: InventoryItem) => {
    try {
      if (isEditing && existingId) {
        // Update existing item
        await updateInventoryItem({
          id: existingId,
          item: modifiedItem,
        });
      } else {
        // Create new item
        await createInventoryItem({
          item: modifiedItem,
        });
      }
      setEditedInventoryItem(null);
    } catch {
      // Don't close the form on error so user can retry
    }
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-slate-50 p-4 shadow-md">
      <div className="flex h-full w-full flex-col">
        <h1 className="mb-4 font-bold text-2xl">
          {isEditing ? 'Edit Inventory Item' : 'Create Inventory Item'}
        </h1>
        <InventoryEditForm
          inventoryItem={inventoryItem}
          setEditedInventoryItem={(item) => {
            if (item) {
              handleSaveItem(item);
            } else {
              setEditedInventoryItem(null);
            }
          }}
        />
      </div>
    </div>
  );
}
