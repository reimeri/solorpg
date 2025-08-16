import { useNavigate } from '@tanstack/react-router';
import { LucideEdit, LucideTrash } from 'lucide-react';
import type { Doc } from '~/../convex/_generated/dataModel';

interface CampaignCardProps {
  campaign: Doc<'campaigns'>;
  onEdit: (campaign: Doc<'campaigns'>) => void;
  onDelete: (campaignId: string) => void;
}

export function CampaignCard({
  campaign,
  onEdit,
  onDelete,
}: CampaignCardProps) {
  const navigate = useNavigate();

  const handleOpenCampaign = () => {
    navigate({
      to: '/campaign/$campaignId',
      params: { campaignId: campaign._id },
    });
  };

  return (
    <button
      className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:bg-slate-50 hover:shadow-lg"
      onClick={handleOpenCampaign}
      type="button"
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="truncate font-semibold text-gray-900 text-xl">
          {campaign.name}
        </h3>
        <div className="flex gap-2">
          <button
            className="cursor-pointer rounded bg-gray-600 px-2 py-1 text-sm text-white transition-colors hover:bg-gray-700"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(campaign);
            }}
            type="button"
          >
            <LucideEdit size={16} />
          </button>
          <button
            className="cursor-pointer rounded bg-red-600 px-2 py-1 text-sm text-white transition-colors hover:bg-red-700"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(campaign._id);
            }}
            type="button"
          >
            <LucideTrash size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-start text-gray-600 text-sm">
        <div>
          <span className="font-medium">Scenario:</span>
          <p className="mt-1 line-clamp-2">{campaign.scenario}</p>
        </div>

        {campaign.rules && (
          <div>
            <span className="font-medium">Rules:</span>
            <p className="mt-1 line-clamp-2">{campaign.rules}</p>
          </div>
        )}

        <div className="mt-4 text-gray-500 text-xs">
          Created: {new Date(campaign._creationTime).toLocaleDateString()}
        </div>
      </div>
    </button>
  );
}
