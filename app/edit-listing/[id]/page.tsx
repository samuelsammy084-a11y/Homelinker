"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white p-4 text-black placeholder:text-black outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  useEffect(() => {
    loadProperty();
  }, []);

  async function loadProperty() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!data) {
      alert("Property not found.");
      router.push("/dashboard");
      return;
    }

    setTitle(data.title);
    setDescription(data.description);
    setPrice(String(data.price));
    setPropertyType(data.property_type);
    setProvince(data.province);
    setCity(data.city);
    setBedrooms(String(data.bedrooms));
    setBathrooms(String(data.bathrooms));
    setParking(String(data.parking));
    setContactNumber(data.contact_number);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("properties")
      .update({
        title,
        description,
        price: Number(price),
        property_type: propertyType,
        province,
        city,
        location: `${city}, ${province}`,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        parking: Number(parking),
        contact_number: contactNumber,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("🎉 Property updated successfully!");

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-black mb-8">
          Edit Property
        </h1>

        <form onSubmit={handleUpdate} className="space-y-6">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Property Title"
            className={inputClass}
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Description"
            className={inputClass}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Monthly Rent"
              className={inputClass}
              required
            />

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Property Type</option>
              <option>Room</option>
              <option>Bachelor</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Townhouse</option>
            </select>

            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Province</option>
              <option>Gauteng</option>
              <option>Western Cape</option>
              <option>KwaZulu-Natal</option>
              <option>Eastern Cape</option>
              <option>Free State</option>
              <option>Limpopo</option>
              <option>Mpumalanga</option>
              <option>North West</option>
              <option>Northern Cape</option>
            </select>

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={inputClass}
              required
            />

            <input
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              type="number"
              placeholder="Bedrooms"
              className={inputClass}
            />

            <input
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              type="number"
              placeholder="Bathrooms"
              className={inputClass}
            />

            <input
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              type="number"
              placeholder="Parking Spaces"
              className={inputClass}
            />

            <input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Contact Number"
              className={inputClass}
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A227] hover:bg-[#A67C00] text-white py-4 rounded-xl font-bold transition"
          >
            {loading ? "Updating..." : "Update Property"}
          </button>

        </form>

      </div>
    </main>
  );
}