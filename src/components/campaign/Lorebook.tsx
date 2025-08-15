import { useQuery } from 'convex/react';
import {
  LucideAArrowDown,
  LucideAsterisk,
  LucideBox,
  LucideCalendarArrowDown,
  LucideCircleQuestionMark,
  LucideFlag,
  LucideHome,
  LucideIceCream,
  LucideSword,
  LucideUser,
} from 'lucide-react';
import { useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';

interface LoreBookProps {
  campaignId: Id<'campaigns'>;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex component
export function Lorebook(props: LoreBookProps) {
  const [sortingByNameEnabled, setSortingByNameEnabled] = useState(true);
  const [sortingByDateEnabled, setSortingByDateEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    | 'all'
    | 'item'
    | 'event'
    | 'location'
    | 'quest'
    | 'character'
    | 'miscellaneous'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const loreBookEntries = useQuery(api.lorebook.get, {
    campaignId: props.campaignId,
  });

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-slate-50 p-2 shadow-md">
      <button
        className="mb-2 cursor-pointer rounded-lg bg-neutral-950 px-4 py-2 text-white hover:bg-neutral-900 active:bg-neutral-800"
        type="button"
      >
        Add new entry
      </button>
      <div className="mb-4 flex">
        <input
          className="flex-1 rounded-lg border border-2 border-gray-300 p-2"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lore..."
          type="text"
          value={searchQuery}
        />
        <button
          className={`ml-2 cursor-pointer rounded-lg px-2 py-2 text-white ${sortingByNameEnabled ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => {
            setSortingByNameEnabled(true);
            setSortingByDateEnabled(false);
          }}
          type="button"
        >
          <LucideAArrowDown
            className={`${sortingByNameEnabled ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
        <button
          className={`ml-2 cursor-pointer rounded-lg px-2 py-2 text-white ${sortingByDateEnabled ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => {
            setSortingByDateEnabled(true);
            setSortingByNameEnabled(false);
          }}
          type="button"
        >
          <LucideCalendarArrowDown
            className={`${sortingByDateEnabled ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
      </div>
      {loreBookEntries !== undefined && loreBookEntries.length !== 0 ? (
        <div className="flex flex-col overflow-y-auto">
          {loreBookEntries
            .filter(
              (entry) =>
                entry.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedCategory === 'all' || entry.type === selectedCategory)
            )
            .sort((a, b) => {
              if (sortingByNameEnabled) {
                return a.name.localeCompare(b.name);
              }
              if (sortingByDateEnabled) {
                return a.updatedAt - b.updatedAt;
              }
              return 0;
            })
            .map((entry) => (
              <div
                className="cursor-pointer select-none rounded-lg bg-slate-200 p-2 hover:bg-slate-300/80 active:bg-slate-300"
                key={entry._id}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{entry.name}</h3>
                  <LucideIceCream className="h-5 w-5 text-neutral-800" />
                </div>
                <hr className="my-1 border-gray-400" />
                <p className="line-clamp-2 text-ellipsis text-gray-700 text-sm">
                  {entry.description}
                </p>
              </div>
            ))}
        </div>
      ) : (
        <h1 className="flex h-full items-center justify-center text-center font-bold text-neutral-800">
          No lorebook entries found.
        </h1>
      )}
      <div className="mt-auto flex">
        <button
          className={`mt-2 mr-auto cursor-pointer rounded-lg px-4 py-2 text-white ${selectedCategory === 'all' ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => setSelectedCategory('all')}
          type="button"
        >
          <LucideAsterisk
            className={`${selectedCategory === 'all' ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
        <button
          className={`mx-auto mt-2 cursor-pointer rounded-lg px-4 py-2 text-white ${selectedCategory === 'character' ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => setSelectedCategory('character')}
          type="button"
        >
          <LucideUser
            className={`${selectedCategory === 'character' ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
        <button
          className={`mx-auto mt-2 cursor-pointer rounded-lg px-4 py-2 text-white ${selectedCategory === 'location' ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => setSelectedCategory('location')}
          type="button"
        >
          <LucideHome
            className={`${selectedCategory === 'location' ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
        <button
          className={`mx-auto mt-2 cursor-pointer rounded-lg px-4 py-2 text-white ${selectedCategory === 'item' ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => setSelectedCategory('item')}
          type="button"
        >
          <LucideSword
            className={`${selectedCategory === 'item' ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
        <button
          className={`mx-auto mt-2 cursor-pointer rounded-lg px-4 py-2 text-white ${selectedCategory === 'event' ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => setSelectedCategory('event')}
          type="button"
        >
          <LucideCircleQuestionMark
            className={`${selectedCategory === 'event' ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
        <button
          className={`mx-auto mt-2 cursor-pointer rounded-lg px-4 py-2 text-white ${selectedCategory === 'quest' ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => setSelectedCategory('quest')}
          type="button"
        >
          <LucideFlag
            className={`${selectedCategory === 'quest' ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
        <button
          className={`mt-2 ml-auto cursor-pointer rounded-lg px-4 py-2 text-white ${selectedCategory === 'miscellaneous' ? 'bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800' : 'inset-ring-2 inset-ring-neutral-950 hover:bg-neutral-200'}`}
          onClick={() => setSelectedCategory('miscellaneous')}
          type="button"
        >
          <LucideBox
            className={`${selectedCategory === 'miscellaneous' ? 'text-white' : 'text-neutral-900'}`}
          />
        </button>
      </div>
    </div>
  );
}
