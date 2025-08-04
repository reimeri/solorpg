import { useConvexMutation, useConvexQuery } from '@convex-dev/react-query';
import type { Doc } from 'convex/_generated/dataModel';
import type { InventoryItem } from 'convex/schema';
import { useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { InventoryItemEdit } from './InventoryItemEdit';

interface InventoryItemViewProps {
  inventoryItem: Doc<'inventoryItems'>;
  setViewedInventoryItem: (item: Doc<'inventoryItems'> | null) => void;
}

function InventoryItemDetails({
  inventoryItem,
}: {
  inventoryItem: Doc<'inventoryItems'>;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Name and Type */}
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">Name</h3>
          <p className="rounded-md border bg-white p-2">{inventoryItem.name}</p>
        </div>
        <div className="flex-1">
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">Type</h3>
          <p className="rounded-md border bg-white p-2 capitalize shadow-sm">
            {inventoryItem.type}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">
            Count
          </h3>
          <p className="rounded-md border bg-white p-2 text-center shadow-sm">
            {inventoryItem.count}
          </p>
        </div>
        <div>
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">
            Weight
          </h3>
          <p className="rounded-md border bg-white p-2 text-center shadow-sm">
            {inventoryItem.weight}
          </p>
        </div>
        <div>
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">
            Value
          </h3>
          <p className="rounded-md border bg-white p-2 text-center shadow-sm">
            {inventoryItem.value}
          </p>
        </div>
        <div>
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">
            Damage
          </h3>
          <p className="rounded-md border bg-white p-2 text-center shadow-sm">
            {inventoryItem.damage}
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="mb-1 block font-medium text-gray-700 text-sm">
          Description
        </h3>
        <div className="h-[258px] max-h-[50svh] min-h-[10svh] overflow-y-auto rounded-md border bg-white p-2 shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed">
            {inventoryItem.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="mb-1 block font-medium text-gray-700 text-sm">Tags</h3>
        <div className="rounded-md border bg-white p-3 shadow-sm">
          {inventoryItem.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {inventoryItem.tags.map((tag) => (
                <span
                  className="inline-block rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm"
                  key={`tag-${tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No tags</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function InventoryItemView({
  inventoryItem,
  setViewedInventoryItem,
}: InventoryItemViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch the latest item data
  const latestItemData = useConvexQuery(api.inventoryItems.getById, {
    id: inventoryItem._id,
  });

  const deleteInventoryItem = useConvexMutation(api.inventoryItems.remove);

  // Use the latest data if available, otherwise fall back to the original prop
  const currentItem = latestItemData || inventoryItem;

  // If the item was deleted in another session, close the view
  if (latestItemData === null) {
    setViewedInventoryItem(null);
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    // Return to view mode after successful edit
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    // Return to view mode when edit is cancelled
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInventoryItem({ id: currentItem._id });
      // Close the view after successful deletion
      setViewedInventoryItem(null);
    } catch {
      // Keep the view open on error so user can retry
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Convert Doc to InventoryItem for editing
  const convertToInventoryItem = (
    doc: Doc<'inventoryItems'>
  ): InventoryItem => ({
    name: doc.name,
    description: doc.description,
    owner: doc.owner,
    campaignId: doc.campaignId,
    type: doc.type,
    count: doc.count,
    weight: doc.weight,
    value: doc.value,
    damage: doc.damage,
    tags: doc.tags,
  });

  // If editing, show the edit component
  if (isEditing) {
    return (
      <InventoryItemEdit
        existingId={currentItem._id}
        inventoryItem={convertToInventoryItem(currentItem)}
        isEditing={true}
        setEditedInventoryItem={(item) => {
          if (item) {
            handleEditComplete();
          } else {
            handleEditCancel();
          }
        }}
      />
    );
  }

  // If showing delete confirmation
  if (showDeleteConfirm) {
    return (
      <div className="flex h-full w-full flex-col rounded-lg bg-slate-50 p-6 shadow-md">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h2 className="font-bold text-gray-800 text-xl">Delete Item</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete "{currentItem.name}"?
            </p>
            <p className="mt-1 text-gray-500 text-sm">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleDeleteCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleDeleteConfirm}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default view mode
  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-slate-50 p-4 shadow-md">
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-bold text-2xl text-gray-800">Item Details</h1>
        </div>

        {/* Content */}
        <div className="mb-6 overflow-y-auto">
          <InventoryItemDetails inventoryItem={currentItem} />
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2">
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setViewedInventoryItem(null)}
            type="button"
          >
            Close
          </button>
          <button
            className="ml-auto rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleEdit}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => setShowDeleteConfirm(true)}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
