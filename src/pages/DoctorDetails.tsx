import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import type { Doctor } from "../types/Doctor";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  let doctors: Doctor[] = [];
  const storedList = localStorage.getItem("doctorsList");
  
  if (storedList) {
    try {
      doctors = JSON.parse(storedList);
    } catch (error) {
      console.error("Failed to parse doctors list:", error);
      // Gracefully handle corrupted data
    }
  }

  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">
            Doctor details not found.
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 text-white font-semibold hover:bg-cyan-600 transition"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const directionsUrl =
    doctor.googleMapsUri ??
    `https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-600 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold">{doctor.name}</h1>
          <p className="mt-1 text-cyan-600">{doctor.hospital}</p>

          {doctor.rating > 0 && (
            <div className="mt-4 flex items-center gap-2 text-orange-500">
              <Star className="h-5 w-5 fill-orange-500" />
              <span className="font-semibold">{doctor.rating}</span>
              <span className="text-sm text-gray-500">
                ({doctor.reviews} reviews)
              </span>
            </div>
          )}

          <p className="mt-4 flex items-start gap-2 text-gray-600">
            <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
            {doctor.address}
          </p>

          {doctor.phone && (
            <p className="mt-2 flex items-center gap-2 text-gray-600">
              <Phone className="h-5 w-5" />
              {doctor.phone}
            </p>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block w-full rounded-xl bg-cyan-500 py-4 text-center text-white text-lg font-bold hover:bg-cyan-600 transition"
          >
            Get Directions
          </a>
        </div>
      </div>
    </>
  );
}

export default DoctorDetails;