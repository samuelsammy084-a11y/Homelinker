"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PostListingPage() {
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
const [loading, setLoading] = useState(false);

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white p-4 text-black placeholder:text-gray-500 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

async function getCoordinates() {
  const address = `${streetAddress}, ${suburb}, ${city}, ${province}, South Africa`;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );

    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon),
      };
    }
  } catch (error) {
    console.error(error);
  }

  return {
    latitude: null,
    longitude: null,
  };
}

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }
const coords = await getCoordinates();

console.log("Coordinates:", coords);

const imageUrls: string[] = [];

    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, image);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    }

    const { error } = await supabase
      .from("properties")
      .insert([
        {
          title,
          description,
          user_id: user.id,
          price: Number(price),
          property_type: propertyType,

street_address: streetAddress,
suburb,

province,
city,

latitude: coords.latitude,
longitude: coords.longitude,

location: `${city}, ${province}`,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          parking: Number(parking),
          contact_number: contactNumber,
          image_url: imageUrls[0],
          image_urls: imageUrls,
          featured: false,
          verified: false,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("🎉 Property posted successfully!");

 setTitle("");
setDescription("");
setPrice("");

setPropertyType("");

setStreetAddress("");
setSuburb("");

setProvince("");
setCity("");

setBedrooms("");
setBathrooms("");
setParking("");

setContactNumber("");

setImages([]);

} // <-- closes handleSubmit

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-extrabold text-center text-black">
          Post Your Property
        </h1>

        <p className="text-center text-gray-600 mt-4 mb-12">
          List your property anywhere in South Africa.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
        >
          <input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            required
          />

          <textarea
            placeholder="Property Description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="number"
              placeholder="Monthly Rent"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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

            <input
  type="text"
  placeholder="Street Address"
  value={streetAddress}
  onChange={(e) => setStreetAddress(e.target.value)}
  className={inputClass}
  required
/>

<input
  type="text"
  placeholder="Suburb"
  value={suburb}
  onChange={(e) => setSuburb(e.target.value)}
  className={inputClass}
  required
/>

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
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
              required
            />

            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className={inputClass}
            />

            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className={inputClass}
            />

            <input
              type="number"
              placeholder="Parking Spaces"
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              className={inputClass}
            />

            <input
              type="tel"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className={inputClass}
              required
            />

          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setImages(Array.from(e.target.files));
              }
            }}
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A227] hover:bg-[#A67C00] text-white py-4 rounded-xl font-bold text-lg transition"
          >
            {loading ? "Posting..." : "Post Property"}
          </button>
        </form>
      </div>
    </main>
  );
}