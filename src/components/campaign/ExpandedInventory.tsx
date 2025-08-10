import { useConvexQuery } from '@convex-dev/react-query';
import type { Doc } from 'convex/_generated/dataModel';
import type { InventoryItem } from 'convex/schema';
import {
  LucideAsterisk,
  LucideBook,
  LucideBox,
  LucideCarrot,
  LucideShield,
  LucideSword,
  LucideX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '~/../convex/_generated/api';
import { cn } from '~/utils/cn';
import { SvgSpinners180RingWithBg } from '../icons/Spinner';
import { InventoryItemIcon } from './Inventory';

interface ExpandedInventoryProps {
  campaign: Doc<'campaigns'>;
  setEditedInventoryItem: (item: InventoryItem | null) => void;
  setViewedInventoryItem: (item: Doc<'inventoryItems'> | null) => void;
  setExpandedInventory: (expanded: boolean) => void;
  inventorySelectionFunction:
    | ((item: Doc<'inventoryItems'>) => void)
    | undefined;
}

function InventoryGridSkeleton() {
  return (
    <div className="flex h-full max-h-1/3 w-full items-center justify-center font-bold">
      <p>Loading inventory...</p>
      <SvgSpinners180RingWithBg className="ml-2 inline-block h-6 w-6" />
    </div>
  );
}

function ExpandedInventoryGrid({
  inventoryItems,
  inventorySelectionFunction,
  ...props
}: { inventoryItems: Doc<'inventoryItems'>[] } & ExpandedInventoryProps) {
  return (
    <div className="h-full min-h-0 w-full flex-1 overflow-y-auto p-2">
      <div className="grid grid-cols-2 gap-2">
        {inventoryItems.map((item) => (
          <button
            className="flex h-16 cursor-pointer items-center rounded-lg bg-neutral-200/60 p-3 hover:bg-neutral-200 active:bg-neutral-200/50"
            key={item._id}
            onClick={() =>
              inventorySelectionFunction !== undefined
                ? (() => {
                    inventorySelectionFunction(item);
                    props.setExpandedInventory(false);
                  })()
                : props.setViewedInventoryItem(item)
            }
            type="button"
          >
            <div className="w-3/4 overflow-hidden">
              <h2 className="select-none overflow-hidden text-ellipsis whitespace-nowrap text-start">
                {item.name}
              </h2>
              <h3 className="w-fit select-none text-gray-500 text-sm">
                {item.type}
              </h3>
            </div>
            {InventoryItemIcon(item.type)}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterButtons({
  setFilteredItems,
  inventoryItems,
  filterMode,
  setFilterMode,
}: {
  setFilteredItems: (items: Doc<'inventoryItems'>[]) => void;
  inventoryItems: Doc<'inventoryItems'>[];
  filterMode:
    | 'all'
    | 'weapon'
    | 'armor'
    | 'consumable'
    | 'document'
    | 'miscellaneous';
  setFilterMode: (
    mode:
      | 'all'
      | 'weapon'
      | 'armor'
      | 'consumable'
      | 'document'
      | 'miscellaneous'
  ) => void;
}) {
  return (
    <div className="flex w-full items-center space-x-2">
      <button
        className={cn(
          'w-full rounded-lg bg-neutral-300 px-2 py-1 text-sm hover:bg-red-400',
          {
            'bg-red-400': filterMode === 'all',
          }
        )}
        onClick={() => {
          setFilteredItems(inventoryItems);
          setFilterMode('all');
        }}
        type="button"
      >
        <LucideAsterisk className="inline-block" />
      </button>
      <button
        className={cn(
          'w-full rounded-lg bg-neutral-300 px-2 py-1 text-sm hover:bg-red-400',
          {
            'bg-red-400': filterMode === 'weapon',
          }
        )}
        onClick={() => {
          setFilteredItems(
            inventoryItems.filter((item) => item.type === 'weapon')
          );
          setFilterMode('weapon');
        }}
        type="button"
      >
        <LucideSword className="inline-block" />
      </button>
      <button
        className={cn(
          'w-full rounded-lg bg-neutral-300 px-2 py-1 text-sm hover:bg-red-400',
          {
            'bg-red-400': filterMode === 'armor',
          }
        )}
        onClick={() => {
          setFilteredItems(
            inventoryItems.filter((item) => item.type === 'armor')
          );
          setFilterMode('armor');
        }}
        type="button"
      >
        <LucideShield className="inline-block" />
      </button>
      <button
        className={cn(
          'w-full rounded-lg bg-neutral-300 px-2 py-1 text-sm hover:bg-red-400',
          {
            'bg-red-400': filterMode === 'consumable',
          }
        )}
        onClick={() => {
          setFilteredItems(
            inventoryItems.filter((item) => item.type === 'consumable')
          );
          setFilterMode('consumable');
        }}
        type="button"
      >
        <LucideCarrot className="inline-block" />
      </button>
      <button
        className={cn(
          'w-full rounded-lg bg-neutral-300 px-2 py-1 text-sm hover:bg-red-400',
          {
            'bg-red-400': filterMode === 'document',
          }
        )}
        onClick={() => {
          setFilteredItems(
            inventoryItems.filter((item) => item.type === 'document')
          );
          setFilterMode('document');
        }}
        type="button"
      >
        <LucideBook className="inline-block" />
      </button>
      <button
        className={cn(
          'w-full rounded-lg bg-neutral-300 px-2 py-1 text-sm hover:bg-red-400',
          {
            'bg-red-400': filterMode === 'miscellaneous',
          }
        )}
        onClick={() => {
          setFilteredItems(
            inventoryItems.filter((item) => item.type === 'miscellaneous')
          );
          setFilterMode('miscellaneous');
        }}
        type="button"
      >
        <LucideBox className="inline-block" />
      </button>
    </div>
  );
}

function InventoryHeader({
  setFilteredItems,
  inventoryItems,
  filterMode,
  setFilterMode,
  searchString,
  setSearchString,
  ...props
}: {
  setFilteredItems: (items: Doc<'inventoryItems'>[]) => void;
  inventoryItems: Doc<'inventoryItems'>[];
  filterMode:
    | 'all'
    | 'weapon'
    | 'armor'
    | 'consumable'
    | 'document'
    | 'miscellaneous';
  setFilterMode: (
    mode:
      | 'all'
      | 'weapon'
      | 'armor'
      | 'consumable'
      | 'document'
      | 'miscellaneous'
  ) => void;
  searchString: string;
  setSearchString: (search: string) => void;
} & ExpandedInventoryProps) {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-4 p-2">
      <div className="flex w-full items-center justify-between gap-4">
        <input
          className="w-full rounded-lg border border-gray-300 px-2 py-1"
          onChange={(e) => {
            setSearchString(e.target.value);
            setFilteredItems(
              inventoryItems.filter(
                (item) =>
                  item.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) &&
                  (item.type === filterMode || filterMode === 'all')
              )
            );
          }}
          placeholder="Search inventory..."
          value={searchString}
        />
        <button
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-neutral-300 text-white hover:bg-red-400"
          onClick={() => props.setExpandedInventory(false)}
          type="button"
        >
          <LucideX className="inline-block size-4" />
        </button>
      </div>
      <FilterButtons
        filterMode={filterMode}
        inventoryItems={inventoryItems}
        setFilteredItems={setFilteredItems}
        setFilterMode={setFilterMode}
      />
    </div>
  );
}

export function ExpandedInventory(props: ExpandedInventoryProps) {
  if (!props.campaign) {
    return <InventoryGridSkeleton />;
  }

  const inventoryItems = useConvexQuery(api.inventoryItems.get, {
    campaignId: props.campaign._id,
  });

  const [filterMode, setFilterMode] = useState<
    'all' | 'weapon' | 'armor' | 'consumable' | 'document' | 'miscellaneous'
  >('all');
  const [filteredItems, setFilteredItems] = useState<Doc<'inventoryItems'>[]>(
    inventoryItems || []
  );

  // Sync filteredItems with inventoryItems, filterMode, and searchString when inventoryItems changes
  const [searchString, setSearchString] = useState('');
  useEffect(() => {
    setFilteredItems(
      (inventoryItems || []).filter(
        (item) =>
          item.name.toLowerCase().includes(searchString.toLowerCase()) &&
          (item.type === filterMode || filterMode === 'all')
      )
    );
  }, [inventoryItems, filterMode, searchString]);

  if (!inventoryItems) {
    return <InventoryGridSkeleton />;
  }

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-slate-50 shadow-lg">
      {props.inventorySelectionFunction !== undefined && <p>Select an item:</p>}
      <InventoryHeader
        filterMode={filterMode}
        inventoryItems={inventoryItems}
        searchString={searchString}
        setFilteredItems={setFilteredItems}
        setFilterMode={setFilterMode}
        setSearchString={setSearchString}
        {...props}
      />
      <ExpandedInventoryGrid
        campaign={props.campaign}
        inventoryItems={filteredItems}
        inventorySelectionFunction={props.inventorySelectionFunction}
        setEditedInventoryItem={props.setEditedInventoryItem}
        setExpandedInventory={props.setExpandedInventory}
        setViewedInventoryItem={props.setViewedInventoryItem}
      />
    </div>
  );
}
