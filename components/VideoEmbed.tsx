"use client";

interface Props {
  url: string;
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);

    // YouTube: youtube.com/watch?v=ID or youtu.be/ID
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo: vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return null;
  } catch {
    return null;
  }
}

export default function VideoEmbed({ url }: Props) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-black aspect-video">
      <iframe
        src={embedUrl}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
