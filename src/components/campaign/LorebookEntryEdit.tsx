import { useConvexMutation } from '@convex-dev/react-query';
import type { LorebookEntry } from 'convex/schema';
import {
  LucideAsterisk,
  LucideCalendarArrowDown,
  LucideFlag,
  LucideHome,
  LucideSword,
  LucideUser,
} from 'lucide-react';
import type { Id } from 'node_modules/convex/dist/esm-types/values/value';
import { useState } from 'react';
import { api } from '../../../convex/_generated/api';

interface LorebookEntryEditProps {
  lorebookEntry: LorebookEntry;
  isEditing?: boolean;
  existingId?: Id<'LorebookEntries'>;
  setEditedLorebookEntry: (entry: LorebookEntry | null) => void;
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

function LorebookEditForm(props: LorebookEntryEditProps) {
  const { lorebookEntry, setEditedLorebookEntry } = props;
  const [modifiedEntry, setModifiedEntry] =
    useState<LorebookEntry>(lorebookEntry);
  const [tagsInput, setTagsInput] = useState<string>(
    lorebookEntry.tags.join(', ')
  );
  const [nameError, setNameError] = useState<string>('');

  const handleInputChange = (
    field: keyof LorebookEntry,
    value: string | LorebookEntry['type']
  ) => {
    // Clear name error when user starts typing in name field
    if (field === 'name' && nameError) {
      setNameError('');
    }

    setModifiedEntry((prev) => ({
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
    setModifiedEntry((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name field
    if (!modifiedEntry.name || modifiedEntry.name.trim() === '') {
      setNameError('Name is required');
      return;
    }

    // Return the modified entry to parent component
    setEditedLorebookEntry(modifiedEntry);
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
              value={modifiedEntry.name}
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
            <div className="relative">
              <select
                className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="type"
                onChange={(e) =>
                  handleInputChange(
                    'type',
                    e.target.value as LorebookEntry['type']
                  )
                }
                required
                value={modifiedEntry.type}
              >
                <option value="character">Character</option>
                <option value="location">Location</option>
                <option value="item">Item</option>
                <option value="event">Event</option>
                <option value="quest">Quest</option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <LorebookEntryIcon
                  className="text-gray-400"
                  type={modifiedEntry.type}
                />
              </div>
            </div>
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
          value={modifiedEntry.description}
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
          placeholder="e.g. important, npc, dungeon"
          type="text"
          value={tagsInput}
        />
        {modifiedEntry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {modifiedEntry.tags.map((tag) => (
              <span
                className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs"
                key={tag}
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
          onClick={() => setEditedLorebookEntry(null)}
          type="button"
        >
          Cancel
        </button>
        <button
          className="ml-auto rounded-lg bg-neutral-950 px-4 py-2 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export function LorebookEntryEdit({
  lorebookEntry,
  isEditing = false,
  existingId,
  setEditedLorebookEntry,
}: LorebookEntryEditProps) {
  const createLorebookEntry = useConvexMutation(api.lorebook.create);
  const updateLorebookEntry = useConvexMutation(api.lorebook.update);

  const handleSaveEntry = async (modifiedEntry: LorebookEntry) => {
    try {
      if (isEditing && existingId) {
        // Update existing entry
        await updateLorebookEntry({
          id: existingId,
          entry: modifiedEntry,
        });
      } else {
        // Create new entry
        await createLorebookEntry({
          entry: modifiedEntry,
        });
      }
      setEditedLorebookEntry(null);
    } catch {
      // Don't close the form on error so user can retry
    }
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-slate-50 p-4 shadow-md">
      <div className="flex h-full w-full flex-col">
        <h1 className="mb-4 font-bold text-2xl">
          {isEditing ? 'Edit Lorebook Entry' : 'Create Lorebook Entry'}
        </h1>
        <LorebookEditForm
          lorebookEntry={lorebookEntry}
          setEditedLorebookEntry={(entry) => {
            if (entry) {
              handleSaveEntry(entry);
            } else {
              setEditedLorebookEntry(null);
            }
          }}
        />
      </div>
    </div>
  );
}
