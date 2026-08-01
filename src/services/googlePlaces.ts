import type { Doctor } from "../types/Doctor";

// Public Overpass instances. The main overpass-api.de server gets rate
// limited (429) easily since it's shared by everyone — we try it first,
// then fall back to mirrors, with a short backoff between retries.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const SEARCH_RADIUS_METERS = 15000;
const MAX_RESULTS = 20;

interface OverpassTags {
  name?: string;
  amenity?: string;
  healthcare?: string;
  "addr:housenumber"?: string;
  "addr:street"?: string;
  "addr:city"?: string;
  "addr:postcode"?: string;
  phone?: string;
  "contact:phone"?: string;
  [key: string]: string | undefined;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: OverpassTags;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function labelForTags(tags: OverpassTags): string {
  const kind = tags.healthcare ?? tags.amenity ?? "clinic";
  const labels: Record<string, string> = {
    doctors: "Doctor's Office",
    doctor: "Doctor's Office",
    clinic: "Clinic",
    centre: "Medical Centre",
    hospital: "Hospital",
  };
  return labels[kind] ?? "Medical Practice";
}

function addressForTags(tags: OverpassTags): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Address not available";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function queryOverpass(query: string): Promise<OverpassResponse> {
  let lastError: Error | null = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    // A couple of retries per endpoint, with backoff, in case of a
    // transient 429/504 before moving on to the next mirror.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: query,
        });

        if (response.status === 429 || response.status === 504) {
          const waitMs = 1500 * (attempt + 1);
          console.warn(
            `Overpass endpoint ${endpoint} returned ${response.status}, retrying in ${waitMs}ms...`
          );
          await sleep(waitMs);
          continue;
        }

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Overpass returned ${response.status}: ${errBody}`);
        }

        return (await response.json()) as OverpassResponse;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }
  }

  throw new Error(
    lastError?.message ??
      "All OpenStreetMap servers are busy right now. Please wait a moment and try again."
  );
}

/**
 * Finds nearby doctors/clinics/hospitals using OpenStreetMap's Overpass API.
 * This is completely free and requires no API key or billing account,
 * unlike Google Places API. Data quality depends on OpenStreetMap coverage
 * in the area, so results (especially ratings) will be sparser than Google's.
 */
export async function findDoctors(
  specialty: string,
  latitude: number,
  longitude: number
): Promise<Doctor[]> {
  const query = `
[out:json][timeout:25];
(
  nwr["amenity"~"^(doctors|clinic|hospital)$"](around:${SEARCH_RADIUS_METERS},${latitude},${longitude});
  nwr["healthcare"~"^(doctor|clinic|hospital|centre)$"](around:${SEARCH_RADIUS_METERS},${latitude},${longitude});
);
out center ${MAX_RESULTS * 2};
`.trim();

  const data = await queryOverpass(query);

  const seen = new Set<string>();
  const doctors: Doctor[] = [];

  for (const el of data.elements) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat === undefined || lon === undefined) continue;

    const tags = el.tags ?? {};
    const name = tags.name;
    if (!name) continue; // skip unnamed entries, not useful to show

    const id = `${el.type}-${el.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    doctors.push({
      id,
      name,
      hospital: labelForTags(tags),
      rating: 0,
      reviews: 0,
      address: addressForTags(tags),
      phone: tags.phone ?? tags["contact:phone"],
      latitude: lat,
      longitude: lon,
      googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
    });
  }

  doctors.sort(
    (a, b) =>
      haversineDistanceMeters(latitude, longitude, a.latitude, a.longitude) -
      haversineDistanceMeters(latitude, longitude, b.latitude, b.longitude)
  );

  // Recommended specialty isn't reliably tagged in OSM, so it's shown to the
  // user as context (in Doctors.tsx) rather than used to filter results here.
  void specialty;

  return doctors.slice(0, MAX_RESULTS);
}