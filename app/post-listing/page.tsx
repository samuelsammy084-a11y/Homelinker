"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createPropertySlug } from "@/lib/property-slug";

import imageCompression from "browser-image-compression";


import ListingTypeStep from "./components/ListingTypeStep";

import PropertyTypeStep from "./components/PropertyTypeStep";
import LocationStep from "./components/LocationStep";
import PropertyDetailsStep from "./components/PropertyDetailsStep";
import PhotosStep from "./components/PhotosStep";
import DescriptionStep from "./components/DescriptionStep";
import ReviewStep from "./components/ReviewStep";

export default function PostListingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // Success & Error Popup
  const [popup, setPopup] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // STEP 1
  const [listingType, setListingType] =
    useState<"rent" | "sale" | "">("");

  // STEP 2
  const [propertyType, setPropertyType] = useState("");

  // STEP 3
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [suburb, setSuburb] = useState("");
  const [address, setAddress] = useState("");

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  // STEP 4
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");

  const [deposit, setDeposit] = useState("");
  const [availableFrom, setAvailableFrom] =
    useState("");

  const [floorSize, setFloorSize] = useState("");
  const [landSize, setLandSize] = useState("");
  const [condition, setCondition] = useState("");
  const [rates, setRates] = useState("");
  const [levies, setLevies] = useState("");

  const [petFriendly, setPetFriendly] =
    useState(false);

  const [furnished, setFurnished] =
    useState(false);

  // STEP 5
  const [images, setImages] = useState<File[]>([]);

  // STEP 6
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  // CONTACT / WHATSAPP
  const [phoneNumber, setPhoneNumber] =
    useState("");

  async function publishListing() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPopup({
        show: true,
        type: "error",
        title: "Login Required",
        message:
          "Please login before posting a property.",
      });
      return;
    }

    if (!phoneNumber.trim()) {
      setPopup({
        show: true,
        type: "error",
        title: "Phone Number Required",
        message:
          "Please enter a phone number so people can contact you through WhatsApp.",
      });
      return;
    }

    try {
      let imageUrl = "";
      const imageUrls: string[] = [];

            // Upload Images
      if (images.length > 0) {
        const compressionOptions = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        for (const image of images) {
          // Compress image
          let imageToUpload = image;
          try {
            imageToUpload = await imageCompression(
              image,
              compressionOptions
            );
          } catch (e) {
            console.error("Compression failed", e);
          }

          const fileName = `${Date.now()}-${Math.random()}-${image.name}`;

          const { error: uploadError } =
            await supabase.storage
              .from("property-images")
              .upload(fileName, imageToUpload);


          if (uploadError) {
            setPopup({
              show: true,
              type: "error",
              title: "Upload Failed",
              message: uploadError.message,
            });
            return;
          }

          const { data } = supabase.storage
            .from("property-images")
            .getPublicUrl(fileName);

          imageUrls.push(data.publicUrl);
        }

        imageUrl = imageUrls[0];
      }

            const { data: insertedProperty, error } = await supabase
        .from("properties")
        .insert([
          {
            user_id: user.id,

            listing_type: listingType,
            property_type: propertyType,

            title,
            description,

            province,
            city,
            suburb,

            street_address: address,

            latitude,
            longitude,

            price: Number(price),

            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            parking: Number(parking),

            deposit: deposit
              ? Number(deposit)
              : null,

            available_from:
              availableFrom || null,

            floor_size: floorSize
              ? Number(floorSize)
              : null,

            land_size: landSize
              ? Number(landSize)
              : null,

            condition: condition || null,

            rates: rates
              ? Number(rates)
              : null,

            levies: levies
              ? Number(levies)
              : null,

            furnished,

            pet_friendly: petFriendly,

            image_url: imageUrl,

            image_urls: imageUrls,

            // Contact / WhatsApp number
            contact_phone: phoneNumber.trim(),
          },
        ])
        .select()
        .single();

      if (error) {
        setPopup({
          show: true,
          type: "error",
          title: "Something went wrong",
          message: error.message,
        });

        return;
      }

      // Generate and update slug with the new ID
      if (insertedProperty) {
        const generatedSlug = createPropertySlug(
          title,
          city,
          insertedProperty.id
        );

        await supabase
          .from("properties")
          .update({ slug: generatedSlug })
          .eq("id", insertedProperty.id);
      }


      setPopup({
        show: true,
        type: "success",
        title: "Listing Published!",
        message:
          "Your property has been successfully listed on HomeLinker.",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);
    } catch (err: unknown) {
      setPopup({
        show: true,
        type: "error",
        title: "Unexpected Error",
        message:
          err instanceof Error
            ? err.message
            : String(err),
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-12">

      {/* Success / Error Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-[fadeIn_.25s_ease]">

            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-5xl ${
                popup.type === "success"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {popup.type === "success"
                ? "✅"
                : "❌"}
            </div>

            <h2 className="mt-6 text-center text-3xl font-black text-[#111111]">
              {popup.title}
            </h2>

            <p className="mt-3 text-center text-[#666666]">
              {popup.message}
            </p>

            <button
              onClick={() =>
                setPopup({
                  show: false,
                  type: "success",
                  title: "",
                  message: "",
                })
              }
              className="mt-8 w-full rounded-2xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00]"
            >
              Continue
            </button>

          </div>

        </div>
      )}

      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">

          <h1 className="text-5xl font-black text-[#111111]">
            Create Listing
          </h1>

          <p className="mt-4 text-[#555555]">
            List your property on HomeLinker
          </p>

        </div>

        <div className="mb-12">

          <div className="mb-6 flex items-center justify-between">

            {[
              "Listing",
              "Property",
              "Location",
              "Details",
              "Photos",
              "Description",
              "Review",
            ].map((label, index) => {
              const current = index + 1;

              return (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all duration-300 ${
                      current < step
                        ? "bg-[#C9A227] text-white shadow-lg"
                        : current === step
                        ? "scale-110 border-4 border-[#C9A227] bg-[#111111] text-white shadow-xl"
                        : "border border-[#E8D9A8] bg-[#F6F2E8] text-[#777777]"
                    }`}
                  >
                    {current < step ? "✓" : current}
                  </div>

                  <span
                    className={`mt-3 text-sm font-semibold ${
                      current <= step
                        ? "text-[#111111]"
                        : "text-[#888888]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}

          </div>

          <div className="relative h-4 overflow-hidden rounded-full bg-[#EFE6C9]">

            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#E5C65B] transition-all duration-500"
              style={{
                width: `${((step - 1) / 6) * 100}%`,
              }}
            />

          </div>

          <div className="mt-3 flex justify-between text-sm font-medium text-[#666666]">

            <span>
              Step {step} of 7
            </span>

            <span>
              {Math.round(
                ((step - 1) / 6) * 100
              )}
              % Complete
            </span>

          </div>

        </div>

        {step === 1 && (
          <ListingTypeStep
            listingType={listingType}
            setListingType={setListingType}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <PropertyTypeStep
            listingType={
              listingType as "rent" | "sale"
            }
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <LocationStep
            province={province}
            setProvince={setProvince}
            city={city}
            setCity={setCity}
            suburb={suburb}
            setSuburb={setSuburb}
            address={address}
            setAddress={setAddress}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <PropertyDetailsStep
            listingType={
              listingType as "rent" | "sale"
            }
            price={price}
            setPrice={setPrice}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            parking={parking}
            setParking={setParking}
            furnished={furnished}
            setFurnished={setFurnished}
            petFriendly={petFriendly}
            setPetFriendly={setPetFriendly}
            deposit={deposit}
            setDeposit={setDeposit}
            availableFrom={availableFrom}
            setAvailableFrom={setAvailableFrom}
            floorSize={floorSize}
            setFloorSize={setFloorSize}
            landSize={landSize}
            setLandSize={setLandSize}
            condition={condition}
            setCondition={setCondition}
            rates={rates}
            setRates={setRates}
            levies={levies}
            setLevies={setLevies}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <PhotosStep
            images={images}
            setImages={setImages}
            onBack={() => setStep(4)}
            onNext={() => setStep(6)}
          />
        )}

        {step === 6 && (
          <DescriptionStep
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onBack={() => setStep(5)}
            onNext={() => setStep(7)}
          />
        )}

        {step === 7 && (
          <ReviewStep
            listingType={listingType}
            propertyType={propertyType}
            title={title}
            description={description}
            province={province}
            city={city}
            suburb={suburb}
            address={address}
            price={price}
            bedrooms={bedrooms}
            bathrooms={bathrooms}
            parking={parking}
            phoneNumber={phoneNumber}
            images={images}
            onBack={() => setStep(6)}
            onPublish={publishListing}
          />
        )}

      </div>
    </main>
  );
}