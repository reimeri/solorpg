import { useConvexMutation, useConvexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { api } from '~/../convex/_generated/api';
import type { Doc, Id } from '~/../convex/_generated/dataModel';
import { CampaignCard } from '~/components/campaigns/CampaignCard';
import { CampaignForm } from '~/components/campaigns/CampaignForm';
import { ConfirmDialog } from '~/components/campaigns/ConfirmDialog';
import { SvgSpinners180RingWithBg } from '~/components/icons/Spinner';

export const Route = createFileRoute('/campaigns/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<Doc<'campaigns'> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    campaignId: string;
    campaignName: string;
  }>({
    isOpen: false,
    campaignId: '',
    campaignName: '',
  });

  const campaigns = useConvexQuery(api.campaigns.list);
  const deleteCampaign = useConvexMutation(api.campaigns.remove);

  const handleCreateNew = () => {
    setEditingCampaign(null);
    setShowForm(true);
  };

  const handleEdit = (campaign: Doc<'campaigns'>) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCampaign(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCampaign(null);
  };

  const handleDeleteRequest = (campaignId: string) => {
    const campaign = campaigns?.find((c) => c._id === campaignId);
    if (campaign) {
      setDeleteConfirm({
        isOpen: true,
        campaignId,
        campaignName: campaign.name,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCampaign({
        campaignId: deleteConfirm.campaignId as Id<'campaigns'>,
      });
      setDeleteConfirm({ isOpen: false, campaignId: '', campaignName: '' });
    } catch (error: unknown) {
      // Handle error
      const errorMessage =
        // biome-ignore lint/suspicious/noExplicitAny: Error type is unknown
        (error as any)?.message || 'Failed to delete campaign';
      window.alert(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, campaignId: '', campaignName: '' });
  };

  if (campaigns === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <SvgSpinners180RingWithBg className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900">My Campaigns</h1>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleCreateNew}
          type="button"
        >
          Create New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-lg border-2 border-gray-300 border-dashed p-12 text-center">
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            No campaigns yet
          </h3>
          <p className="text-gray-600">
            Get started by creating your first campaign!
          </p>
          <button
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleCreateNew}
            type="button"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              campaign={campaign}
              key={campaign._id}
              onDelete={handleDeleteRequest}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CampaignForm
          campaign={editingCampaign}
          onCancel={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmDialog
        cancelText="Cancel"
        confirmText="Delete"
        danger={true}
        isOpen={deleteConfirm.isOpen}
        message={`Are you sure you want to delete "${deleteConfirm.campaignName}"? This action cannot be undone and will also delete all associated characters, inventory items, messages, and lorebook entries.`}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Campaign"
      />
    </div>
  );
}
