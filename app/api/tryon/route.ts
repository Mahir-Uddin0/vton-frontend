const TRY_ON_ENDPOINT = "https://vton-backend-006d.onrender.com/tryon";

export const runtime = "nodejs";
export const maxDuration = 60;

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

/**
 * Same-origin proxy for the remote virtual try-on service. Keeping the remote
 * URL here avoids a browser CORS dependency and preserves the original files
 * while renaming the fields to the backend's expected multipart contract.
 */
export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const personImage = incoming.get("person_image");
    const garmentImage = incoming.get("garment_image");
    const description = incoming.get("description");

    if (!(personImage instanceof File) || !(garmentImage instanceof File)) {
      return error("Both a person image and a garment image are required.", 400);
    }
    if (typeof description !== "string" || !description.trim()) {
      return error("A garment description is required.", 400);
    }

    const body = new FormData();
    body.append("person_image", personImage, personImage.name);
    body.append("garment_image", garmentImage, garmentImage.name);
    body.append("description", description.trim());

    const upstream = await fetch(TRY_ON_ENDPOINT, {
      method: "POST",
      body,
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  } catch (cause) {
    console.error("Try-on proxy failed:", cause);
    return error("Unable to reach the try-on service. Please try again.", 502);
  }
}
