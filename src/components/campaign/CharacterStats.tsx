import { useConvexQuery } from '@convex-dev/react-query';
import { LucideEdit } from 'lucide-react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';

interface CharacterStatsProps {
  campaignId: string;
}

export function CharacterStats({ campaignId }: CharacterStatsProps) {
  const character = useConvexQuery(api.characters.get, {
    campaignId: campaignId as Id<'campaigns'>,
  });

  return (
    <div className="flex h-full max-h-1/12 w-full rounded-xl bg-slate-50 p-2 shadow-md">
      {character ? (
        <div className="flex w-full flex-col gap-2">
          <div className="mb-2 flex w-full items-center gap-4">
            <h1 className="font-bold text-xl">{character.name}</h1>
            <p>Lvl: {character.level}</p>
            <p className="ml-auto">Race: {character.race}</p>
            <button
              className="cursor-pointer rounded-lg bg-neutral-200 p-1 hover:bg-blue-200 active:bg-blue-300"
              type="button"
            >
              <LucideEdit className="size-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-center">
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">STR</p>
              <p>{character.stats.strength}</p>
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">AGI</p>
              <p>{character.stats.agility}</p>
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">MND</p>
              <p>{character.stats.mind}</p>
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">CON</p>
              <p>{character.stats.constitution}</p>
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">CHA</p>
              <p>{character.stats.charisma}</p>
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading character...</p>
      )}
    </div>
  );
}
