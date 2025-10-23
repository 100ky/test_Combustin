"use client";

import { useState, useEffect, FC } from "react";
import { SocialLink } from "./SocialNetworksManager";

// --- Constants ---

/**
 * A record mapping social network names to their corresponding SVG icons.
 * This allows for easy rendering of icons based on the social network name.
 */
const socialIcons: Record<SocialLink["name"], React.ReactNode> = {
  Facebook: (
    <svg
      className="h-8 w-8 text-blue-600"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
    </svg>
  ),
  Twitter: (
    <svg
      className="h-8 w-8 text-sky-500"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.32 4.507 2.09 7.14 2.09 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
    </svg>
  ),
  Instagram: (
    <svg
      className="h-8 w-8 text-pink-500"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.472.01-4.69.066-2.41.11-3.513 1.21-3.623 3.622-.056 1.22-.066 1.566-.066 4.691s.01 3.471.066 4.69c.11 2.41 1.213 3.513 3.623 3.623 1.218.056 1.574.066 4.69.066s3.472-.01 4.69-.066c2.41-.11 3.513-1.21 3.623-3.622.056-1.22.066-1.566.066-4.691s-.01-3.471-.066-4.69c-.11-2.41-1.213-3.513-3.623-3.623C15.472 3.975 15.116 3.965 12 3.965zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.802a1.948 1.948 0 110 3.896 1.948 1.948 0 010-3.896zM16.95 6.4a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"></path>
    </svg>
  ),
  LinkedIn: (
    <svg
      className="h-8 w-8 text-blue-700"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
    </svg>
  ),
};

// --- TypeScript Interfaces ---
interface AddSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (social: Omit<SocialLink, "id">) => void;
}

/**
 * A modal component for adding a new social network link.
 * It's a two-step process: first select the social network, then enter the link.
 */
const AddSocialModal: FC<AddSocialModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // --- State Management ---
  const [selectedSocial, setSelectedSocial] = useState<
    SocialLink["name"] | null
  >(null); // The currently selected social network
  const [link, setLink] = useState(""); // The URL of the social network profile

  // --- Effects ---

  // Reset state when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedSocial(null);
      setLink("");
    }
  }, [isOpen]);

  // --- Render Logic ---

  // Don't render the modal if it's not open
  if (!isOpen) return null;

  /**
   * Handles the save action. It calls the onSave prop with the new social link
   * and closes the modal.
   */
  const handleSave = () => {
    if (selectedSocial && link.trim()) {
      onSave({ name: selectedSocial, link: link.trim() });
      onClose();
    }
  };

  return (
    <div
      className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className="mx-4 w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Step 1: Select a social network */}
        {!selectedSocial ? (
          <>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Vyberte sociální síť
            </h3>
            <div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
              {Object.keys(socialIcons).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedSocial(key as SocialLink["name"])}
                  className="cursor-pointer rounded-lg bg-gray-100 p-3 transition hover:bg-blue-100"
                >
                  {socialIcons[key as SocialLink["name"]]}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Step 2: Enter the link */
          <div>
            <label
              htmlFor="social-link"
              className="mb-1 block text-sm font-medium text-gray-600"
            >{`Váš profil na ${selectedSocial}`}</label>
            <input
              type="text"
              id="social-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Vložte odkaz nebo uživatelské jméno"
              autoFocus
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedSocial(null)} // Go back to the social network selection
                className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300"
              >
                Zpět
              </button>
              <button
                onClick={handleSave}
                className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Uložit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSocialModal;
