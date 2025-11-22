/**
 * API route for forcefully signing out a user.
 *
 * This endpoint calls the signOutCompletely action and redirects the user
 * to the home page after sign-out is complete.
 */
import { NextResponse } from "next/server";

import { signOutCompletely } from "@/lib/authActions";
import { ORIGIN_URL } from "@/utils/env";

export async function GET() {
  await signOutCompletely(false);
  return NextResponse.redirect(ORIGIN_URL!);
}
