import { useState } from 'react';
import type { Id } from '~/../convex/_generated/dataModel';
import { EquipmentSlotGrid } from './EquipmentSlotGrid';

interface CharacterStats {
  strength: number;
  agility: number;
  constitution: number;
  mind: number;
  charisma: number;
}

interface EquipmentSlot {
  name: string;
  enabled: boolean;
  equippedItemId?: Id<'inventoryItems'>;
}

interface CharacterData {
  name: string;
  description: string;
  race: string;
  level: number;
  stats: CharacterStats;
  equipmentSlots: EquipmentSlot[];
}

interface CharacterCreationFormProps {
  onCharacterCreate: (character: CharacterData) => void;
  onBack: () => void;
}

// Default equipment slots similar to the characters.ts file
const defaultEquipmentSlots: EquipmentSlot[] = [
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'head' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'back' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'left hand' },
  { enabled: true, name: 'left arm' },
  { enabled: true, name: 'body' },
  { enabled: true, name: 'right arm' },
  { enabled: true, name: 'right hand' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'legs' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
  { enabled: true, name: 'feet' },
  { enabled: false, name: 'air' },
  { enabled: false, name: 'air' },
];

interface StatInputProps {
  label: string;
  value: number;
  onUpdate: (value: number) => void;
}

function StatInput(props: StatInputProps) {
  const { label, value, onUpdate } = props;
  const inputId = `stat-${label.toLowerCase()}`;
  return (
    <div className="flex items-center gap-2">
      <label
        className="w-12 font-medium text-gray-700 text-sm"
        htmlFor={inputId}
      >
        {label}:
      </label>
      <input
        className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        id={inputId}
        max={20}
        min={1}
        onChange={(e) => onUpdate(Number(e.target.value))}
        type="number"
        value={value}
      />
    </div>
  );
}

export function CharacterCreationForm({
  onCharacterCreate,
  onBack,
}: CharacterCreationFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [race, setRace] = useState('');
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState<CharacterStats>({
    strength: 10,
    agility: 10,
    constitution: 10,
    mind: 10,
    charisma: 10,
  });
  const [equipmentSlots, setEquipmentSlots] = useState<EquipmentSlot[]>(
    defaultEquipmentSlots
  );

  const handleStatChange = (statName: keyof CharacterStats, value: number) => {
    setStats((prev) => ({ ...prev, [statName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const character: CharacterData = {
      name,
      description,
      race,
      level,
      stats,
      equipmentSlots,
    };

    onCharacterCreate(character);
  };

  const totalStats = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
  const isValid = name.trim() && race.trim() && description.trim();

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="mb-6 font-bold text-2xl text-gray-900">
          Create Your Character
        </h2>
      </div>

      {/* Basic Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            className="block font-medium text-gray-700 text-sm"
            htmlFor="characterName"
          >
            Character Name *
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            id="characterName"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter character name"
            required
            type="text"
            value={name}
          />
        </div>

        <div>
          <label
            className="block font-medium text-gray-700 text-sm"
            htmlFor="characterRace"
          >
            Race *
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            id="characterRace"
            onChange={(e) => setRace(e.target.value)}
            placeholder="e.g., Human, Elf, Dwarf"
            required
            type="text"
            value={race}
          />
        </div>
      </div>

      <div>
        <label
          className="block font-medium text-gray-700 text-sm"
          htmlFor="characterDescription"
        >
          Description *
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          id="characterDescription"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your character's appearance, background, personality..."
          required
          rows={3}
          value={description}
        />
      </div>

      <div>
        <label
          className="block font-medium text-gray-700 text-sm"
          htmlFor="characterLevel"
        >
          Starting Level
        </label>
        <input
          className="mt-1 block w-20 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          id="characterLevel"
          max={20}
          min={1}
          onChange={(e) => setLevel(Number(e.target.value))}
          type="number"
          value={level}
        />
      </div>

      {/* Stats */}
      <div>
        <h3 className="mb-3 font-medium text-gray-900 text-lg">
          Character Stats
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <StatInput
            label="Strength"
            onUpdate={(value: number) => handleStatChange('strength', value)}
            value={stats.strength}
          />
          <StatInput
            label="Agility"
            onUpdate={(value: number) => handleStatChange('agility', value)}
            value={stats.agility}
          />
          <StatInput
            label="Constitution"
            onUpdate={(value: number) =>
              handleStatChange('constitution', value)
            }
            value={stats.constitution}
          />
          <StatInput
            label="Mind"
            onUpdate={(value: number) => handleStatChange('mind', value)}
            value={stats.mind}
          />
          <StatInput
            label="Charisma"
            onUpdate={(value: number) => handleStatChange('charisma', value)}
            value={stats.charisma}
          />
        </div>
        <p className="mt-2 text-gray-600 text-sm">
          Total stat points: {totalStats}
        </p>
      </div>

      {/* Equipment Slots */}
      <div>
        <EquipmentSlotGrid
          onSlotsChange={setEquipmentSlots}
          slots={equipmentSlots}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onBack}
          type="button"
        >
          Back to Campaign
        </button>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={!isValid}
          type="submit"
        >
          Create Campaign & Character
        </button>
      </div>
    </form>
  );
}
