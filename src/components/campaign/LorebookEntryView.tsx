import { useConvexMutation, useConvexQuery } from '@convex-dev/react-query';
import type { LorebookEntry } from 'convex/schema';
import {
  LucideAsterisk,
  LucideCalendarArrowDown,
  LucideFlag,
  LucideHome,
  LucideSword,
  LucideUser,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Doc } from '~/../convex/_generated/dataModel';
import { api } from '../../../convex/_generated/api';
import { LorebookEntryEdit } from './LorebookEntryEdit';

interface LorebookEntryViewProps {
  lorebookEntry: Doc<'LorebookEntries'>;
  setViewedLorebookEntry: (entry: Doc<'LorebookEntries'> | null) => void;
}

function LorebookEntryIcon({
  type,
  size = 1.25,
  className,
}: {
  type: 'item' | 'character' | 'location' | 'event' | 'quest' | 'miscellaneous';
  size?: number;
  className?: string;
}) {
  const style = { height: `${size}rem`, width: `${size}rem` };

  switch (type) {
    case 'item':
      return <LucideSword className={className} style={style} />;
    case 'character':
      return <LucideUser className={className} style={style} />;
    case 'location':
      return <LucideHome className={className} style={style} />;
    case 'event':
      return <LucideCalendarArrowDown className={className} style={style} />;
    case 'quest':
      return <LucideFlag className={className} style={style} />;
    case 'miscellaneous':
      return <LucideAsterisk className={className} style={style} />;
    default:
      return <LucideAsterisk className={className} style={style} />;
  }
}

function LorebookEntryDetails({
  lorebookEntry,
}: {
  lorebookEntry: Doc<'LorebookEntries'>;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Name and Type */}
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">Name</h3>
          <p className="rounded-md border bg-white p-2">{lorebookEntry.name}</p>
        </div>
        <div className="flex-1">
          <h3 className="mb-1 block font-medium text-gray-700 text-sm">Type</h3>
          <span className="flex items-center justify-between rounded-md border bg-white p-2 shadow-sm">
            <p className="capitalize">{lorebookEntry.type}</p>
            <LorebookEntryIcon type={lorebookEntry.type} />
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="mb-1 block font-medium text-gray-700 text-sm">
          Description
        </h3>
        <div className="h-[258px] max-h-[50svh] min-h-[10svh] overflow-y-auto rounded-md border bg-white p-2 shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed">
            {lorebookEntry.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="mb-1 block font-medium text-gray-700 text-sm">Tags</h3>
        <div className="rounded-md border bg-white p-3 shadow-sm">
          {lorebookEntry.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {lorebookEntry.tags.map((tag) => (
                <span
                  className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs"
                  key={tag}
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

      {/* Last Updated */}
      <div>
        <h3 className="mb-1 block font-medium text-gray-700 text-sm">
          Last Updated
        </h3>
        <p className="rounded-md border bg-white p-2 text-gray-600">
          {new Date(lorebookEntry.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export function LorebookEntryView({
  lorebookEntry,
  setViewedLorebookEntry,
}: LorebookEntryViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch the latest entry data
  const latestEntryData = useConvexQuery(api.lorebook.getById, {
    id: lorebookEntry._id,
  });

  const deleteLorebookEntry = useConvexMutation(api.lorebook.remove);

  // Use the latest data if available, otherwise fall back to the original prop
  const currentEntry = latestEntryData || lorebookEntry;

  // If the entry was deleted in another session, close the view

  useEffect(() => {
    if (latestEntryData === null) {
      setViewedLorebookEntry(null);
    }
  }, [latestEntryData, setViewedLorebookEntry]);

  if (latestEntryData === null) {
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
      await deleteLorebookEntry({ id: currentEntry._id });
      // Close the view after successful deletion
      setViewedLorebookEntry(null);
    } catch {
      // Keep the view open on error so user can retry
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Convert Doc to LorebookEntry for editing
  const convertToLorebookEntry = (
    doc: Doc<'LorebookEntries'>
  ): LorebookEntry => ({
    name: doc.name,
    description: doc.description,
    type: doc.type,
    tags: doc.tags,
    campaignId: doc.campaignId,
    userId: doc.userId,
    updatedAt: doc.updatedAt,
  });

  // If editing, show the edit component
  if (isEditing) {
    return (
      <LorebookEntryEdit
        existingId={currentEntry._id}
        isEditing={true}
        lorebookEntry={convertToLorebookEntry(currentEntry)}
        setEditedLorebookEntry={(entry) => {
          if (entry) {
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
            <h2 className="font-bold text-gray-800 text-xl">Delete Entry</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete "
              <span className="font-semibold">{currentEntry.name}</span>
              "?
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
          <h1 className="font-bold text-2xl text-gray-800">Entry Details</h1>
        </div>

        {/* Content */}
        <div className="mb-6 overflow-y-auto">
          <LorebookEntryDetails lorebookEntry={currentEntry} />
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2">
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setViewedLorebookEntry(null)}
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
