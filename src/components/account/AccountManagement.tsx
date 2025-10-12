"use client";

import { useSession } from "next-auth/react";
import "./AccountManagement.css";

import { Account } from "@/types/account";
import { updateAccount } from "@/lib/api";
import { useState, useEffect, FC } from "react";

// --- TypeScript Interfaces ---
// Defines the structure for a social media link object.
interface SocialLink {
  id: number;
  name: "Facebook" | "Twitter" | "Instagram" | "LinkedIn";
  link: string;
}

// --- SVG Icon Components ---
// A simple plus icon component.
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

// A simple delete icon component.
const DeleteIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// A record mapping social media names to their corresponding SVG icons.
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

// --- Social Link Item Component ---
// Defines the props for the SocialLinkItem component.
interface SocialLinkItemProps {
  item: SocialLink;
  onDelete: (id: number) => void;
  isRemoving: boolean;
}

// Renders a single social link item with its icon, name, link, and a delete button.
// It includes animations for mounting and unmounting.
const SocialLinkItem: FC<SocialLinkItemProps> = ({
  item,
  onDelete,
  isRemoving,
}) => {
  // State to manage the mount animation.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger enter animation shortly after mounting.
    setIsMounted(true);
  }, []);

  // Determines the animation classes based on the component's state.
  const animationClasses =
    isMounted && !isRemoving ? "" : isRemoving ? "removing" : "entering";

  return (
    <div
      className={`social-item ${animationClasses} flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3`}
    >
      <div className="flex items-center gap-4">
        {socialIcons[item.name]}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{item.name}</span>
          <a
            href={item.link.startsWith("http") ? item.link : `//${item.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm break-all text-blue-600 hover:underline"
          >
            {item.link}
          </a>
        </div>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="text-gray-400 transition hover:text-red-500"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

// --- Add Social Modal Component ---
// Defines the props for the AddSocialModal component.
interface AddSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (social: SocialLink) => void;
}

// A modal dialog for adding a new social media link.
// It guides the user through selecting a social network and then entering their link.
const AddSocialModal: FC<AddSocialModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // State for the selected social network.
  const [selectedSocial, setSelectedSocial] = useState<
    SocialLink["name"] | null
  >(null);
  // State for the input link.
  const [link, setLink] = useState("");

  useEffect(() => {
    // Reset component state when the modal is opened.
    if (isOpen) {
      setSelectedSocial(null);
      setLink("");
    }
  }, [isOpen]);

  // Do not render the modal if it's not open.
  if (!isOpen) return null;

  // Handles the save action, creating a new social link object.
  const handleSave = () => {
    if (selectedSocial && link.trim()) {
      onSave({ id: Date.now(), name: selectedSocial, link: link.trim() });
      onClose(); // Close modal on save.
    }
  };

  return (
    <div
      className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
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
                  className="rounded-lg bg-gray-100 p-3 transition hover:bg-blue-100"
                >
                  {socialIcons[key as SocialLink["name"]]}
                </button>
              ))}
            </div>
          </>
        ) : (
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
                onClick={() => setSelectedSocial(null)}
                className="rounded-md bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300"
              >
                Zpět
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
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

// --- Main Account Management Component ---
// The main component for managing user account information, including personal details and social links.
interface AccountManagementProps {
  account: Account;
}

const AccountManagement: FC<AccountManagementProps> = ({ account }) => {
  // State for the list of social media links.
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    account.socialNets
      ? account.socialNets.map((link, index) => ({
          id: index, // Simple ID generation
          name: extractSocialName(link) as SocialLink["name"],
          link: link,
        }))
      : [],
  );
  // State to track which link is being removed for animation purposes.
  const [removingLinkId, setRemovingLinkId] = useState<number | null>(null);
  // State to control the visibility of the 'Add Social' modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for the user's desired role (moderator or admin).
  const [desiredRole, setDesiredRole] = useState<"moderator" | "admin" | null>(
    account.moderationInterest ? "moderator" : null,
  );
  // State to track if the user has expressed interest in a role.
  const [interestChecked, setInterestChecked] = useState(
    account.moderationInterest || false,
  );
  // State to track if any form data has been changed.
  const [isDirty, setIsDirty] = useState(false);
  const { data: session } = useSession();
  
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

  // State for save operation
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("loaded");

    return () => {
      document.body.classList.remove("loaded");
    };
  }, []);

  // Helper to guess social media name from URL
  const extractSocialName = (url: string) => {
    if (url.includes("facebook")) return "Facebook";
    if (url.includes("twitter")) return "Twitter";
    if (url.includes("instagram")) return "Instagram";
    if (url.includes("linkedin")) return "LinkedIn";
    return "Facebook"; // Default
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (!isDirty) {
      setIsDirty(true);
    }
  };

  // Adds a new social link to the state.
  const handleAddSocial = (social: SocialLink) => {
    setSocialLinks((prev) => [...prev, social]);
    setIsDirty(true);
  };

  // Deletes a social link from the state with a delay for the animation.
  const handleDeleteSocial = (id: number) => {
    setRemovingLinkId(id);
    setIsDirty(true);
    setTimeout(() => {
      setSocialLinks((prev) => prev.filter((link) => link.id !== id));
      setRemovingLinkId(null);
    }, 400); // Corresponds to the CSS animation duration.
  };

  // Handles the checkbox for expressing interest in a role.
  const handleRoleInterestCheck = () => {
    if (!desiredRole) {
      alert(
        "Prosím, vyberte roli (moderátor nebo admin), o kterou máte zájem.",
      );
      return;
    }
    setInterestChecked(!interestChecked);
    setIsDirty(true);
  };

  // Updates the desired role when the user clicks the corresponding button.
  const handleDesiredRoleChange = (role: "moderator" | "admin") => {
    setDesiredRole(role);
    setIsDirty(true);
  };

  // Consolidate all data into formData before saving
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      socialNets: socialLinks.map(sl => sl.link),
      moderationInterest: interestChecked,
    }));
  }, [socialLinks, interestChecked]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    // Create a copy to avoid mutating state directly.
    const payload: Partial<Account> = { ...formData };

    // Remove optional fields if they are empty strings, as the backend might not expect them.
    // This aligns with the successful request observed in Insomnia.
    if (payload.imageUrl === "") {
      delete payload.imageUrl;
    }
    if (payload.description === "") {
      delete payload.description;
    }
    if (payload.organization === "") {
      delete payload.organization;
    }
    if (payload.profession === "") {
      delete payload.profession;
    }

    console.log("Data being sent:", payload);

    const accessToken = session?.accessToken;
    if (!accessToken) {
      setSaveError("Chyba: Nejste přihlášeni.");
      setIsSaving(false);
      return;
    }

    try {
      await updateAccount(payload, accessToken);
      setSaveSuccess(true);
      setIsDirty(false);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3s
    } catch (error) {
      console.error("Failed to save account data:", error);
      setSaveError("Nepodařilo se uložit změny. Zkuste to prosím znovu.");
    } finally {
      setIsSaving(false);
    }
  };

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

      {/* Personal Information Card */}
      <div className="animate-on-load mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
          Osobní údaje
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Jméno
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Příjmení
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={session?.user?.email ?? ""}
              readOnly
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Role field with a descriptive tooltip */}
          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Role
            </label>
            <div className="group relative">
              <p className="flex h-[42px] cursor-help items-center rounded-md border border-yellow-200 bg-yellow-100 p-2.5 text-xs font-semibold text-yellow-800">
                Nebuď srab a staň se moderátorem/adminem.
              </p>
              <div className="pointer-events-none absolute top-1/2 left-full z-10 ml-4 w-72 -translate-y-1/2 rounded-lg bg-gray-800 p-3 text-sm text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                <h4 className="font-bold">Práva rolí:</h4>
                <ul className="mt-1 list-inside list-disc">
                  <li>
                    <b>Moderátor:</b> Může upravovat a schvalovat obsah.
                  </li>
                  <li>
                    <b>Admin:</b> Může spravovat uživatele a nastavovat systém.
                  </li>
                </ul>
                <div className="absolute top-1/2 left-[-8px] h-4 w-4 -translate-y-1/2 rotate-45 transform bg-gray-800"></div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="profession"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Profese
            </label>
            <input
              type="text"
              id="profession"
              value={formData.profession}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Např. Projektový manažer"
            />
          </div>
          <div>
            <label
              htmlFor="organization"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Organizace / Firma
            </label>
            <input
              type="text"
              id="organization"
              value={formData.organization}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Název firmy"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="admin-notes"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Poznámky pro administrátory
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Zde můžete zanechat vzkaz pro administrátory..."
            ></textarea>
          </div>

          {/* Interactive section for users to express interest in a higher role */}
          <div className="md:col-span-2">
            <div className="mt-2 flex items-center">
              <input
                id="moderator-interest"
                name="moderator-interest"
                type="checkbox"
                checked={interestChecked}
                onChange={handleRoleInterestCheck}
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                disabled={!desiredRole}
              />
              <div className="ml-3 block text-sm text-gray-700">
                <span>Mám zájem být </span>
                <button
                  type="button"
                  onClick={() => handleDesiredRoleChange("moderator")}
                  className={`rounded-md p-1 font-semibold transition ${desiredRole === "moderator" ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"}`}
                >
                  moderátor
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => handleDesiredRoleChange("admin")}
                  className={`rounded-md p-1 font-semibold transition ${desiredRole === "admin" ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"}`}
                >
                  admin
                </button>
                <span>.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Networks Card */}
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
      </div>

      {/* Modal for adding social links */}
      <AddSocialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSocial}
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
