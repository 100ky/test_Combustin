"use client";

import { useState, FC } from "react";
import SocialLinkItem from "./SocialLinkItem";
import AddSocialModal from "./AddSocialModal";

// --- TypeScript Interfaces ---
/**
 * Represents a single social network link.
 */
export interface SocialLink {
  id: number;
  name: "Facebook" | "Twitter" | "Instagram" | "LinkedIn";
  link: string;
}

/**
 * Props for the SocialNetworksManager component.
 */
interface SocialNetworksManagerProps {
  initialSocialNets: string[];
  onSocialLinksChange: (links: string[]) => void;
}

// --- Helper Functions ---
/**
 * Extracts the social network name from a URL.
 * @param url The URL of the social network profile.
 * @returns The name of the social network.
 */
const extractSocialName = (url: string): SocialLink["name"] => {
  if (url.includes("facebook")) return "Facebook";
  if (url.includes("twitter")) return "Twitter";
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("linkedin")) return "LinkedIn";
  return "Facebook"; // Default value if no match is found
};

// --- SVG Icon Components ---
/**
 * A simple SVG icon component for the "Add" button.
 */
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

/**
 * A component for managing a list of social network links.
 * It allows users to add, view, and delete their social media profiles.
 */
const SocialNetworksManager: FC<SocialNetworksManagerProps> = ({
  initialSocialNets,
  onSocialLinksChange,
}) => {
  // --- State Management ---
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() =>
    initialSocialNets.map((link, index) => ({
      id: index,
      name: extractSocialName(link),
      link: link,
    })),
  );
  const [removingLinkId, setRemovingLinkId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Event Handlers ---

  /**
   * Handles adding a new social link.
   * @param social The new social link to add (without an ID).
   */
  const handleAddSocial = (social: Omit<SocialLink, "id">) => {
    const newSocialLink: SocialLink = {
      id:
        socialLinks.length > 0
          ? Math.max(...socialLinks.map((l) => l.id)) + 1
          : 0,
      ...social,
    };
    const updatedSocialLinks = [...socialLinks, newSocialLink];
    setSocialLinks(updatedSocialLinks);
    onSocialLinksChange(updatedSocialLinks.map((sl) => sl.link));
  };

  /**
   * Handles deleting a social link from the list.
   * @param id The ID of the social link to delete.
   */
  const handleDeleteSocial = (id: number) => {
    setRemovingLinkId(id);
    setTimeout(() => {
      const updatedSocialLinks = socialLinks.filter((link) => link.id !== id);
      setSocialLinks(updatedSocialLinks);
      onSocialLinksChange(updatedSocialLinks.map((sl) => sl.link));
      setRemovingLinkId(null);
    }, 400); // Corresponds to the duration of the exit animation
  };

  // --- Render ---
  return (
    <div className="animate-on-load rounded-lg bg-[var(--background)] p-6 shadow">
      {/* Header with Title and Add Button */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Sociální sítě
        </h2>
        <button
          id="add-social-btn"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center rounded-full bg-blue-600 p-2 font-bold text-white hover:bg-blue-700"
        >
          <PlusIcon />
        </button>
      </div>

      {/* List of Social Links */}
      <div className="space-y-4">
        {socialLinks.map((item) => (
          <SocialLinkItem
            key={item.id}
            item={item}
            onDelete={handleDeleteSocial}
            isRemoving={removingLinkId === item.id}
          />
        ))}
        {socialLinks.length === 0 && (
          <p className="text-sm text-gray-500">
            Zatím nemáte přidané žádné sociální sítě.
          </p>
        )}
      </div>

      {/* Modal for Adding a New Social Link */}
      <AddSocialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSocial}
      />
    </div>
  );
};

export default SocialNetworksManager;
