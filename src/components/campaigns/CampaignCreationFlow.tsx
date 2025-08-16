import { useConvexMutation } from '@convex-dev/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Doc, Id } from '~/../convex/_generated/dataModel';
import { CharacterCreationForm } from './CharacterCreationForm';

interface CampaignData {
  name: string;
  scenario: string;
  firstMessage: string;
  rules: string;
}

interface CharacterData {
  name: string;
  description: string;
  race: string;
  level: number;
  stats: {
    strength: number;
    agility: number;
    constitution: number;
    mind: number;
    charisma: number;
  };
  equipmentSlots: Array<{
    name: string;
    enabled: boolean;
    equippedItemId?: Id<'inventoryItems'>;
  }>;
}

interface CampaignCreationFlowProps {
  campaign?: Doc<'campaigns'> | null;
  onCancel: () => void;
  onSuccess: () => void;
}

function CampaignDetailsForm({
  onNext,
  onCancel,
  initialData,
}: {
  onNext: (data: CampaignData) => void;
  onCancel: () => void;
  initialData?: CampaignData;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [scenario, setScenario] = useState(initialData?.scenario || '');
  const [firstMessage, setFirstMessage] = useState(
    initialData?.firstMessage || ''
  );
  const [rules, setRules] = useState(initialData?.rules || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ name, scenario, firstMessage, rules });
  };

  const isValid = name.trim() && scenario.trim() && firstMessage.trim();

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="mb-6 font-bold text-2xl text-gray-900">
          Create New Campaign
        </h2>
        <p className="mb-6 text-gray-600 text-sm">
          Step 1 of 2: Set up your campaign details
        </p>
      </div>

      <div>
        <label
          className="block font-medium text-gray-700 text-sm"
          htmlFor="name"
        >
          Campaign Name *
        </label>
        <input
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          id="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter campaign name"
          required
          type="text"
          value={name}
        />
      </div>

      <div>
        <label
          className="block font-medium text-gray-700 text-sm"
          htmlFor="scenario"
        >
          Scenario Description *
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          id="scenario"
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Describe the campaign setting and scenario"
          required
          rows={4}
          value={scenario}
        />
      </div>

      <div>
        <label
          className="block font-medium text-gray-700 text-sm"
          htmlFor="firstMessage"
        >
          Opening Message *
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          id="firstMessage"
          onChange={(e) => setFirstMessage(e.target.value)}
          placeholder="The opening message to start the campaign"
          required
          rows={3}
          value={firstMessage}
        />
      </div>

      <div>
        <label
          className="block font-medium text-gray-700 text-sm"
          htmlFor="rules"
        >
          Rules & Guidelines
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          id="rules"
          onChange={(e) => setRules(e.target.value)}
          placeholder="Special rules or guidelines for this campaign (optional)"
          rows={3}
          value={rules}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={!isValid}
          type="submit"
        >
          Next: Create Character
        </button>
      </div>
    </form>
  );
}

export function CampaignCreationFlow({
  campaign,
  onCancel,
  onSuccess,
}: CampaignCreationFlowProps) {
  const [step, setStep] = useState<'campaign' | 'character'>(
    campaign ? 'campaign' : 'campaign'
  );
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const createCampaignWithCharacter = useConvexMutation(
    api.campaigns.createWithCharacter
  );
  const updateCampaign = useConvexMutation(api.campaigns.update);

  const handleCampaignNext = (data: CampaignData) => {
    if (campaign) {
      // If editing existing campaign, just update it
      handleCampaignUpdate(data);
    } else {
      // If creating new campaign, proceed to character creation
      setCampaignData(data);
      setStep('character');
    }
  };

  const handleCampaignUpdate = async (data: CampaignData) => {
    if (!campaign) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCampaign({
        campaignId: campaign._id,
        name: data.name,
        scenario: data.scenario,
        firstMessage: data.firstMessage,
        rules: data.rules,
      });
      onSuccess();
    } catch (error) {
      let errorMessage = 'Failed to update campaign';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      window.alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCharacterCreate = async (character: CharacterData) => {
    if (!campaignData) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCampaignWithCharacter({
        campaign: campaignData,
        character,
      });

      // Navigate to the new campaign
      navigate({
        to: '/campaign/$campaignId',
        params: { campaignId: result.campaignId },
      });

      onSuccess();
    } catch (error) {
      let errorMessage = 'Failed to create campaign and character';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      window.alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'character') {
      setStep('campaign');
    } else {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="mt-2 text-gray-600">Creating campaign...</p>
            </div>
          </div>
        )}

        {step === 'campaign' && (
          <CampaignDetailsForm
            initialData={
              campaign
                ? {
                    name: campaign.name,
                    scenario: campaign.scenario,
                    firstMessage: campaign.firstMessage,
                    rules: campaign.rules,
                  }
                : undefined
            }
            onCancel={onCancel}
            onNext={handleCampaignNext}
          />
        )}

        {step === 'character' && (
          <div>
            <div className="mb-6">
              <p className="text-gray-600 text-sm">
                Step 2 of 2: Create your character for "{campaignData?.name}"
              </p>
            </div>
            <CharacterCreationForm
              onBack={handleBack}
              onCharacterCreate={handleCharacterCreate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
