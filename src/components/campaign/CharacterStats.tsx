import { useConvexMutation, useConvexQuery } from '@convex-dev/react-query';
import { LucideCheck, LucideEdit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Id } from '~/../convex/_generated/dataModel';

interface CharacterStatsProps {
  campaignId: string;
}

function StatCard({
  name,
  value,
  setValue,
  isEditing,
}: {
  name: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  isEditing: boolean;
}) {
  return (
    <span className="flex-1 rounded-lg bg-neutral-200">
      <p className="mt-1 font-bold text-sm">{name}</p>
      {isEditing ? (
        <input
          className="w-[80px] py-1 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          onChange={(e) => setValue(Number(e.target.value))}
          type="number"
          value={value}
        />
      ) : (
        <p className="py-1 text-sm">{value}</p>
      )}
    </span>
  );
}

function NameElement({
  value,
  setValue,
  isEditing,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
}) {
  return isEditing ? (
    <input
      className="w-[150px] rounded font-bold text-xl [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      onChange={(e) => setValue(e.target.value)}
      type="text"
      value={value}
    />
  ) : (
    <h1 className="font-bold text-xl">{value}</h1>
  );
}

function LevelElement({
  value,
  setValue,
  isEditing,
}: {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  isEditing: boolean;
}) {
  return isEditing ? (
    <div className="flex items-center gap-2">
      <p>Lvl: </p>
      <input
        className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={(e) => setValue(Number(e.target.value))}
        type="number"
        value={value}
      />
    </div>
  ) : (
    <p>Lvl: {value}</p>
  );
}

function RaceElement({
  value,
  setValue,
  isEditing,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
}) {
  return isEditing ? (
    <div className="flex items-center gap-2">
      <p>Race: </p>
      <input
        className="w-[98px] rounded"
        onChange={(e) => setValue(e.target.value)}
        type="text"
        value={value}
      />
    </div>
  ) : (
    <p className="ml-auto">Race: {value}</p>
  );
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
            <NameElement
              isEditing={isEditing}
              setValue={setName}
              value={name}
            />
            <LevelElement
              isEditing={isEditing}
              setValue={setLevel}
              value={level}
            />
            <RaceElement
              isEditing={isEditing}
              setValue={setRace}
              value={race}
            />
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
            <StatCard
              isEditing={isEditing}
              name="STR"
              setValue={setStrength}
              value={strength}
            />
            <StatCard
              isEditing={isEditing}
              name="AGI"
              setValue={setAgility}
              value={agility}
            />
            <StatCard
              isEditing={isEditing}
              name="MND"
              setValue={setMind}
              value={mind}
            />
            <StatCard
              isEditing={isEditing}
              name="CON"
              setValue={setConstitution}
              value={constitution}
            />
            <StatCard
              isEditing={isEditing}
              name="CHA"
              setValue={setCharisma}
              value={charisma}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading character...</p>
      )}
    </div>
  );
}
