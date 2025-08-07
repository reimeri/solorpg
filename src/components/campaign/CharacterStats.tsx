import { useConvexQuery } from '@convex-dev/react-query';
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
        <div>
          <h2 className="font-semibold text-lg">Character Stats</h2>
          <p>Name: {character.name}</p>
          <p>Level: {character.level}</p>
          <p>Race: {character.race}</p>
        </div>
      ) : (
        <p className="text-gray-500">Loading character...</p>
      )}
    </div>
  );
}
