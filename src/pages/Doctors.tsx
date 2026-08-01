import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, MapPin, Phone, RefreshCw, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import { findDoctors } from "../services/googlePlaces";
import type { Doctor } from "../types/Doctor";
import type { AIResult } from "../types/AIResult";

function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const runSearch = useCallback(
    (forceRefresh: boolean) => {
      const storedResult = localStorage.getItem("aiResult");

      if (!storedResult) {
        navigate("/symptoms");
        return;
      }

      let aiResult: AIResult;
      try {
        aiResult = JSON.parse(storedResult);
      } catch {
        navigate("/symptoms");
        return;
      }

      setSpecialty(aiResult.specialty);
      setLoading(true);
      setError(null);

      // If we already searched for this exact specialty (e.g. the user is
      // navigating back from a doctor's detail page), reuse the cached
      // results instead of hitting geolocation + Overpass again.
      if (!forceRefresh) {
        const cachedSpecialty = localStorage.getItem("doctorsListSpecialty");
        const cachedList = localStorage.getItem("doctorsList");

        if (cachedSpecialty === aiResult.specialty && cachedList) {
          try {
            setDoctors(JSON.parse(cachedList));
            setLoading(false);
            return;
          } catch {
            // Fall through to a fresh fetch if the cache is somehow corrupt.
          }
        }
      }

      if (!navigator.geolocation) {
        setError("Location access is not supported by your browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const results = await findDoctors(
              aiResult.specialty,
              position.coords.latitude,
              position.coords.longitude
            );
            localStorage.setItem("doctorsList", JSON.stringify(results));
            localStorage.setItem("doctorsListSpecialty", aiResult.specialty);
            setDoctors(results);
          } catch (err) {
            console.error(err);
            setError(
              err instanceof Error
                ? err.message
                : "Something went wrong while finding nearby doctors."
            );
          } finally {
            setLoading(false);
          }
        },
        (geoErr) => {
          console.error(geoErr);
          setError(
            "We couldn't access your location. Please allow location access in your browser and try again."
          );
          setLoading(false);
        }
      );
    },
    [navigate]
  );

  useEffect(() => {
    // Guards against React StrictMode running this effect twice in dev,
    // which would otherwise fire two near-simultaneous requests and make
    // hitting the free Overpass server's rate limit more likely.
    if (hasFetched.current) return;
    hasFetched.current = true;
    runSearch(false);
  }, [runSearch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-cyan-500" />
          <p className="mt-4 text-gray-600">Finding doctors near you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold text-red-500">{error}</p>
          <button
            onClick={() => runSearch(true)}
            className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 text-white font-semibold hover:bg-cyan-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-600">
              Doctors near you
            </h1>
            <p className="mt-2 text-gray-600">
              Recommended specialty:{" "}
              <span className="font-semibold">{specialty}</span>
            </p>
          </div>

          <button
            onClick={() => runSearch(true)}
            className="flex items-center gap-2 shrink-0 rounded-xl border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Search again
          </button>
        </div>

        {doctors.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">
            No doctors found nearby. Try again later.
          </p>
        ) : (
          <div className="mt-8 grid gap-5">
            {doctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => navigate(`/doctor/${doctor.id}`)}
                className="text-left rounded-xl bg-white p-5 shadow hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold">{doctor.name}</h2>
                  {doctor.rating > 0 && (
                    <div className="flex items-center gap-1 text-orange-500 shrink-0">
                      <Star className="h-4 w-4 fill-orange-500" />
                      <span className="font-semibold">{doctor.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({doctor.reviews})
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-cyan-600">{doctor.hospital}</p>
                <p className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  {doctor.address}
                </p>
                {doctor.phone && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {doctor.phone}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Doctors;