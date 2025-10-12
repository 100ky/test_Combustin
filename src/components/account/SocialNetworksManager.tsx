"use client";

import { useState, useEffect, FC } from "react";
import SocialLinkItem from "./SocialLinkItem";
import AddSocialModal from "./AddSocialModal";

// --- TypeScript Interfaces ---
export interface SocialLink {
  id: number;
  name: "Facebook" | "Twitter" | "Instagram" | "LinkedIn";
  link: string;
}

interface SocialNetworksManagerProps {
  initialSocialNets: string[];
  onSocialLinksChange: (links: string[]) => void;
}

// --- Helper Functions ---
const extractSocialName = (url: string): SocialLink["name"] => {
  if (url.includes("facebook")) return "Facebook";
  if (url.includes("twitter")) return "Twitter";
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("linkedin")) return "LinkedIn";
  return "Facebook"; // Default
};

// --- SVG Icon Components ---
const PlusIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

const SocialNetworksManager: FC<SocialNetworksManagerProps> = ({
  initialSocialNets,
  onSocialLinksChange,
}) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    initialSocialNets.map((link, index) => ({
      id: index,
      name: extractSocialName(link),
      link: link,
    })),
  );
  const [removingLinkId, setRemovingLinkId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notify parent component about changes
  useEffect(() => {
    onSocialLinksChange(socialLinks.map((sl) => sl.link));
  }, [socialLinks, onSocialLinksChange]);

  const handleAddSocial = (social: Omit<SocialLink, "id">) => {
    setSocialLinks((prev) => [...prev, { ...social, id: Date.now() }]);
  };

  const handleDeleteSocial = (id: number) => {
    setRemovingLinkId(id);
    setTimeout(() => {
      setSocialLinks((prev) => prev.filter((link) => link.id !== id));
      setRemovingLinkId(null);
    }, 400); // Animation duration
  };

  return (
    <div className="animate-on-load rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-xl font-semibold text-gray-900">Sociální sítě</h2>
        <button
          id="add-social-btn"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center rounded-full bg-blue-600 p-2 font-bold text-white hover:bg-blue-700"
        >
          <PlusIcon />
        </button>
      </div>
      <div className="space-y-4">
        {socialLinks.map((link) => (
          <SocialLinkItem
            key={link.id}
            item={link}
            onDelete={handleDeleteSocial}
            isRemoving={removingLinkId === link.id}
          />
        ))}
        {socialLinks.length === 0 && (
          <p className="text-sm text-gray-500">
            Zatím nemáte přidané žádné sociální sítě.
          </p>
        )}
      </div>
      <AddSocialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSocial}
      />
    </div>
  );
};

export default SocialNetworksManager;
