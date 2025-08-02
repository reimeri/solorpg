import { useConvexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { Id } from 'node_modules/convex/dist/esm-types/values/value';
import { createContext } from 'react';
import { CharacterStats } from '~/components/campaign/CharacterStats';
import { ChatMessageInput } from '~/components/campaign/ChatMessageInput';
import { ChatMessageWindow } from '~/components/campaign/ChatMessageWindow';
import { Gear } from '~/components/campaign/Gear';
import { Inventory } from '~/components/campaign/Inventory';
import { Lorebook } from '~/components/campaign/Lorebook';
import { TOP_BAR_HEIGHT } from '~/components/TopBar';
import { api } from '../../../../convex/_generated/api';

export const Route = createFileRoute('/campaign/$campaignId/')({
  component: RouteComponent,
});

export const CampaignContext = createContext<{
  _id: Id<'campaigns'>;
  _creationTime: number;
  name: string;
  owner: Id<'users'>;
  description: string;
} | null>(null);

function RouteComponent() {
  const { campaignId } = Route.useParams();
  const campaign = useConvexQuery(api.campaigns.get, {
    campaignId: campaignId as Id<'campaigns'>,
  });

  return (
    <div
      className="flex w-full justify-center gap-4"
      style={{ height: `calc(100vh - ${TOP_BAR_HEIGHT}px)` }}
    >
      <CampaignContext value={campaign ?? null}>
        <div className="my-2 flex w-full max-w-[500px] flex-col gap-4">
          <CharacterStats />
          <Gear />
          <Inventory />
        </div>
        <div className="my-2 flex w-full max-w-[1000px] flex-col gap-4">
          <ChatMessageWindow />
          <ChatMessageInput />
        </div>
        <div className="my-2 flex w-full max-w-[500px] flex-col">
          <Lorebook />
        </div>
      </CampaignContext>
    </div>
  );
}
