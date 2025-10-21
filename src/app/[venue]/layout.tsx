import type { Metadata } from "next";

/**
 * Venue-scoped layout that sets metadata based on venue API response.
 * - Uses organization description for meta description
 * - Uses organization logo for icons/OpenGraph/Twitter
 * - Applies to all nested routes under /[venue]
 */
export async function generateMetadata({
  params,
}: {
  params: { venue: string };
}): Promise<Metadata> {
  const slug = params.venue;
  let data:
    | {
        colorTheme?: string;
        companyName?: string;
        slug?: string;
        logo?: string;
        description?: string;
      }
    | undefined;

  try {
    const res = await fetch(
      `https://ishop.kg/api/organizations/${encodeURIComponent(slug)}/`,
      {
        // Cache softly to avoid hammering the API but keep it reasonably fresh
        next: { revalidate: 300 },
      }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch {
    // Ignore errors and fall back to defaults
  }

  const companyName = data?.companyName?.trim();
  const description = data?.description?.trim();
  const logo = data?.logo?.trim();

  const title = companyName ? `${companyName} — ishop` : "ishop";

  return {
    title,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      images: logo ? [{ url: logo }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description: description || undefined,
      images: logo ? [logo] : undefined,
    },
    icons: logo
      ? {
          icon: logo,
          shortcut: logo,
          apple: logo,
        }
      : undefined,
  };
}

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Nested layout: just render children; metadata is provided above.
  return <>{children}</>;
}
