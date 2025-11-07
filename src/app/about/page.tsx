/**
 * About page for the Combustion web application
 *
 * This page provides information about the project, its purpose, and the team.
 * The title is localized using the translation utility.
 *
 * Author: Garbage Collectors Headquarters
 * Date: July 2025
 */
import { t } from "@/utils/translations";
import { promises as fs } from "fs";
import { marked } from "marked";
import path from "path";

export default async function AboutPage() {
  const markdownPath = path.join(
    process.cwd(),
    "src",
    "app",
    "about",
    "about.md",
  );
  const fileContent = await fs.readFile(markdownPath, "utf-8");
  const htmlContent = await marked(fileContent);

  return (
    <div className="h-[calc(100vh-80px)] w-full">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t("navigation.about")}</h1>
        </div>
        <div
          className="prose prose-lg mt-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
