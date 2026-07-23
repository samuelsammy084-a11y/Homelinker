"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PostListingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [propertyType, setPropertyType] = useState("");

  const [streetAddress, setStreetAddress] = useState("");
  const [suburb, setSuburb] = useState("");

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");

  const [contactNumber, setContactNumber] = useState("");

  const [images, setImages] = useState<File[]>([]);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white p-4 text-black placeholder:text-gray-500 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first.");
        return;
      }

      const { data: property, error } = await supabase
        .from("properties")
        .insert({
          title,
          description,
          price: Number(price),
          property_type: propertyType,
          street_address: streetAddress,
          suburb,
          province,
          city,
          bedrooms: Number(bedrooms || 0),
          bathrooms: Number(bathrooms || 0),
          parking: Number(parking || 0),
          contact_number: contactNumber,
          user_id: user.id,

          // IMPORTANT
          status: "draft",
          plan: null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      sessionStorage.setItem("propertyId", property.id);

      router.push("/pricing");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-extrabold text-center text-black">
          Post Your Property
        </h1>

        <p className="text-center text-black mt-4 mb-12">
          Fill in your property details before choosing a listing plan.
        </p>

        <form
          onSubmit={handleContinue}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
        >

          <input
            className={inputClass}
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className={inputClass}
            rows={5}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="number"
              className={inputClass}
              placeholder="Monthly Rent"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <select
              className={inputClass}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
            >
              <option value="">Property Type</option>
              <option>Room</option>
              <option>Bachelor</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Townhouse</option>
            </select>

            <input
              className={inputClass}
              placeholder="Street Address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />

            <input
              className={inputClass}
              placeholder="Suburb"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              required
            />

            <select
              className={inputClass}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
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
              className={inputClass}
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <input
              type="number"
              className={inputClass}
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />

            <input
              type="number"
              className={inputClass}
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            />

            <input
              type="number"
              className={inputClass}
              placeholder="Parking"
              value={parking}
              onChange={(e) => setParking(e.target.value)}
            />

            <input
              className={inputClass}
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />

          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            className={inputClass}
            onChange={(e) => {
              if (e.target.files) {
                setImages(Array.from(e.target.files));
              }
            }}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#C9A227] hover:bg-[#A67C00] text-white py-4 rounded-xl font-bold text-lg"
          >
            Continue to Pricing →
          </button>

        </form>

      </div>
    </main>
  );
}