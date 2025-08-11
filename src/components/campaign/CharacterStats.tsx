import { useConvexMutation, useConvexQuery } from '@convex-dev/react-query';
import { LucideCheck, LucideEdit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';

interface CharacterStatsProps {
  campaignId: string;
}

export function CharacterStats({ campaignId }: CharacterStatsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const character = useConvexQuery(api.characters.get, {
    campaignId: campaignId as Id<'campaigns'>,
  });

  const [name, setName] = useState(character?.name || '');
  const [race, setRace] = useState(character?.race || '');
  const [strength, setStrength] = useState(character?.stats.strength || 0);
  const [agility, setAgility] = useState(character?.stats.agility || 0);
  const [mind, setMind] = useState(character?.stats.mind || 0);
  const [constitution, setConstitution] = useState(
    character?.stats.constitution || 0
  );
  const [charisma, setCharisma] = useState(character?.stats.charisma || 0);
  const [level, setLevel] = useState(character?.level || 0);

  useEffect(() => {
    if (character) {
      setName(character.name);
      setRace(character.race);
      setStrength(character.stats.strength);
      setAgility(character.stats.agility);
      setMind(character.stats.mind);
      setConstitution(character.stats.constitution);
      setCharisma(character.stats.charisma);
      setLevel(character.level);
    }
  }, [character]);

  const updateCharacter = useConvexMutation(api.characters.updateCharacter);

  return (
    <div className="flex h-full max-h-1/12 w-full rounded-xl bg-slate-50 p-2 shadow-md">
      {character ? (
        <div className="flex w-full flex-col gap-2">
          <div className="mb-2 flex w-full items-center gap-4">
            {isEditing ? (
              <input
                className="w-[150px] rounded font-bold text-xl [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
              />
            ) : (
              <h1 className="font-bold text-xl">{character.name}</h1>
            )}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <p>Lvl: </p>
                <input
                  className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => setLevel(Number(e.target.value))}
                  type="number"
                  value={level}
                />
              </div>
            ) : (
              <p>Lvl: {character.level}</p>
            )}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <p>Race: </p>
                <input
                  className="w-[98px] rounded"
                  onChange={(e) => setRace(e.target.value)}
                  type="text"
                  value={race}
                />
              </div>
            ) : (
              <p className="ml-auto">Race: {race}</p>
            )}
            <button
              className="cursor-pointer rounded-lg bg-neutral-200 p-1 hover:bg-blue-200 active:bg-blue-300"
              onClick={() => {
                if (isEditing) {
                  // Destructure the character object to remove _id and _creationTime
                  const { _id, _creationTime, ...characterData } = character;
                  updateCharacter({
                    characterId: _id,
                    fields: {
                      ...characterData,
                      stats: {
                        strength,
                        agility,
                        mind,
                        constitution,
                        charisma,
                      },
                      level,
                      name,
                      race,
                    },
                  });
                }
                setIsEditing(!isEditing);
              }}
              type="button"
            >
              {isEditing ? (
                <LucideCheck className="size-4" />
              ) : (
                <LucideEdit className="size-4" />
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-center">
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">STR</p>
              {isEditing ? (
                <input
                  className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => setStrength(Number(e.target.value))}
                  type="number"
                  value={strength}
                />
              ) : (
                <p>{strength}</p>
              )}
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">AGI</p>
              {isEditing ? (
                <input
                  className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => setAgility(Number(e.target.value))}
                  type="number"
                  value={agility}
                />
              ) : (
                <p>{agility}</p>
              )}
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">MND</p>
              {isEditing ? (
                <input
                  className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => setMind(Number(e.target.value))}
                  type="number"
                  value={mind}
                />
              ) : (
                <p>{mind}</p>
              )}
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">CON</p>
              {isEditing ? (
                <input
                  className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => setConstitution(Number(e.target.value))}
                  type="number"
                  value={constitution}
                />
              ) : (
                <p>{constitution}</p>
              )}
            </span>
            <span className="flex-1 rounded-lg bg-neutral-200">
              <p className="mt-1 font-bold text-sm">CHA</p>
              {isEditing ? (
                <input
                  className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => setCharisma(Number(e.target.value))}
                  type="number"
                  value={charisma}
                />
              ) : (
                <p>{charisma}</p>
              )}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading character...</p>
      )}
    </div>
  );
}
