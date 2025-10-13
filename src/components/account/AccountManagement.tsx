"use client";

import { useState, useEffect, FC, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Account } from "@/types/account";
import { updateAccountAction } from "@/app/account/actions";

import PersonalInformationForm from "./PersonalInformationForm";
import SocialNetworksManager from "./SocialNetworksManager";
import "./AccountManagement.css";

// --- TypeScript Interfaces ---
interface AccountManagementProps {
  account: Account;
}

/**
 * Main component for managing user account details.
 * It handles form state, changes, and saving data to the backend.
 */
const AccountManagement: FC<AccountManagementProps> = ({ account }) => {
  const { data: session } = useSession();

  // --- State Management ---
  const [isDirty, setIsDirty] = useState(false); // Tracks if the form has unsaved changes
  const [isSaving, setIsSaving] = useState(false); // Tracks if the form is currently being saved
  const [saveSuccess, setSaveSuccess] = useState(false); // Tracks if the save was successful
  const [saveError, setSaveError] = useState<string | null>(null); // Holds any error message from saving

  // Form data state, initialized with account details
  const [formData, setFormData] = useState<Partial<Account>>({
    id: account.id,
    firstName: account.firstName || "",
    lastName: account.lastName || "",
    imageUrl: account.imageUrl || "",
    profession: account.profession || "",
    organization: account.organization || "",
    description: account.description || "",
    socialNets: account.socialNets || [],
    moderationInterest: account.moderationInterest || false,
  });

  // --- Effects ---

  // Apply loaded class for entry animations on mount
  useEffect(() => {
    document.body.classList.add("loaded");
    return () => {
      document.body.classList.remove("loaded");
    };
  }, []);

  // --- Event Handlers ---

  /**
   * Handles changes from form inputs and updates the form data state.
   * Memoized with useCallback to prevent re-renders.
   */
  const handleFormChange = useCallback((updatedData: Partial<Account>) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
    if (!isDirty) setIsDirty(true);
  }, [isDirty]);

  /**
   * Handles saving the entire form data to the backend.
   */
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const payload: Partial<Account> = { ...formData };

    // Remove optional fields if they are empty strings to keep the database clean
    if (payload.imageUrl === "") delete payload.imageUrl;
    if (payload.description === "") delete payload.description;
    if (payload.organization === "") delete payload.organization;
    if (payload.profession === "") delete payload.profession;

    try {
      const result = await updateAccountAction(payload);
      if (result.success) {
        setSaveSuccess(true);
        setIsDirty(false);
        setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to save account data:", error);
      setSaveError("Nepodařilo se uložit změny. Zkuste to prosím znovu.");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Callback for when social links are changed in the SocialNetworksManager.
   * Memoized to prevent re-renders.
   */
  const onSocialLinksChange = useCallback((newSocialNets: string[]) => {
    handleFormChange({ socialNets: newSocialNets });
  }, [handleFormChange]);

  // --- Render ---
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 className="animate-on-load mb-6 text-3xl font-bold text-gray-900">
        Správa účtu
      </h1>

      {/* Save status notifications */}
      {saveSuccess && (
        <div className="mb-4 rounded-md bg-green-100 p-4 text-green-800">
          Změny byly úspěšně uloženy.
        </div>
      )}
      {saveError && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-800">
          {saveError}
        </div>
      )}

      {/* Personal Information Form Section */}
      <PersonalInformationForm
        initialData={formData}
        session={session}
        onFormChange={handleFormChange}
      />

      {/* Social Networks Management Section */}
      <SocialNetworksManager
        initialSocialNets={formData.socialNets || []}
        onSocialLinksChange={onSocialLinksChange}
      />

      {/* A floating "Save Changes" button that appears when the form is dirty */}
      {isDirty && (
        <div className="fixed bottom-0 left-1/2 w-full max-w-4xl -translate-x-1/2 p-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full transform rounded-md bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Ukládání..." : "Uložit změny"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
