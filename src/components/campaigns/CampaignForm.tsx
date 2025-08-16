import { useConvexMutation } from '@convex-dev/react-query';
import { useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Doc } from '~/../convex/_generated/dataModel';

interface CampaignFormProps {
  campaign?: Doc<'campaigns'> | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CampaignForm({
  campaign,
  onCancel,
  onSuccess,
}: CampaignFormProps) {
  const [name, setName] = useState(campaign?.name || '');
  const [scenario, setScenario] = useState(campaign?.scenario || '');
  const [firstMessage, setFirstMessage] = useState(
    campaign?.firstMessage || ''
  );
  const [rules, setRules] = useState(campaign?.rules || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCampaign = useConvexMutation(api.campaigns.create);
  const updateCampaign = useConvexMutation(api.campaigns.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (campaign) {
        // Update existing campaign
        await updateCampaign({
          campaignId: campaign._id,
          name,
          scenario,
          firstMessage,
          rules,
        });
      } else {
        // Create new campaign
        await createCampaign({
          name,
          scenario,
          firstMessage,
          rules,
        });
      }
      onSuccess();
    } catch (error) {
      // Log error for debugging
      let errorMessage = 'Failed to save campaign';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // Replace with proper error handling in production
      window.alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return 'Saving...';
    }
    return campaign ? 'Update Campaign' : 'Create Campaign';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 font-bold text-2xl text-gray-900">
          {campaign ? 'Edit Campaign' : 'Create New Campaign'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              disabled={isSubmitting}
              type="submit"
            >
              {getButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
