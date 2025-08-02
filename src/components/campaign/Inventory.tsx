import { useConvexQuery } from '@convex-dev/react-query';
import { useContext } from 'react';
import { CampaignContext } from '~/routes/campaign/$campaignId';
import { api } from '../../../convex/_generated/api';

export function Inventory() {
  const campaign = useContext(CampaignContext);

  return (
    <div className="flex h-full max-h-1/3 w-full rounded-xl bg-slate-50 p-2 shadow-md">
      Inventory for campaign
      {campaign?._id || 'Unknown Campaign'}
    </div>
  );
}
