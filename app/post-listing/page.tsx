"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  const [publishing, setPublishing] = useState(false);

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

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // STEP 4
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");

  const [deposit, setDeposit] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");

  const [floorSize, setFloorSize] = useState("");
  const [landSize, setLandSize] = useState("");
  const [condition, setCondition] = useState("");
  const [rates, setRates] = useState("");
  const [levies, setLevies] = useState("");

  const [petFriendly, setPetFriendly] = useState(false);
  const [furnished, setFurnished] = useState(false);

  // STEP 5
  const [images, setImages] = useState<File[]>([]);

  // STEP 6
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // CONTACT / WHATSAPP
  const [phoneNumber, setPhoneNumber] = useState("");

  function showError(title: string, message: string) {
    setPopup({
      show: true,
      type: "error",
      title,
      message,
    });
  }

  async function publishListing() {
    if (publishing) {
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      showError(
        "Login Required",
        "Please login before posting a property."
      );
      return;
    }

    // --------------------------------------------------
    // REQUIRED FIELD VALIDATION
    // --------------------------------------------------

    if (listingType !== "rent" && listingType !== "sale") {
      showError(
        "Listing Type Required",
        "Please choose whether the property is for rent or for sale."
      );
      return;
    }

    if (!propertyType.trim()) {
      showError(
        "Property Type Required",
        "Please select a property type."
      );
      return;
    }

    if (!province.trim() || !city.trim()) {
      showError(
        "Location Required",
        "Please select a province and city."
      );
      return;
    }

    if (!suburb.trim()) {
      showError(
        "Suburb Required",
        "Please enter the suburb where the property is located."
      );
      return;
    }

    if (!address.trim()) {
      showError(
        "Address Required",
        "Please enter the property's street address."
      );
      return;
    }

    // --------------------------------------------------
    // MAP VALIDATION
    // --------------------------------------------------

    if (latitude === null || longitude === null) {
      showError(
        "Map Location Required",
        "Please select the property's location on the map."
      );
      return;
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      showError(
        "Invalid Location",
        "The selected map location is invalid."
      );
      return;
    }

    // --------------------------------------------------
    // TITLE / DESCRIPTION VALIDATION
    // --------------------------------------------------

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (cleanTitle.length < 5) {
      showError(
        "Title Too Short",
        "Please enter a property title of at least 5 characters."
      );
      return;
    }

    if (cleanTitle.length > 150) {
      showError(
        "Title Too Long",
        "Property titles cannot be longer than 150 characters."
      );
      return;
    }

    if (cleanDescription.length < 20) {
      showError(
        "Description Too Short",
        "Please provide at least 20 characters describing the property."
      );
      return;
    }

    if (cleanDescription.length > 5000) {
      showError(
        "Description Too Long",
        "Property descriptions cannot exceed 5,000 characters."
      );
      return;
    }

    // --------------------------------------------------
    // PRICE VALIDATION
    // --------------------------------------------------

    const numericPrice = Number(price);

    if (
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      showError(
        "Invalid Price",
        "Please enter a valid property price greater than R0."
      );
      return;
    }

    if (numericPrice > 1_000_000_000) {
      showError(
        "Invalid Price",
        "The property price is too large. Please check the amount."
      );
      return;
    }

    // --------------------------------------------------
    // BEDROOM / BATHROOM / PARKING VALIDATION
    // --------------------------------------------------

    const numericBedrooms =
      bedrooms.trim() === "" ? 0 : Number(bedrooms);

    const numericBathrooms =
      bathrooms.trim() === "" ? 0 : Number(bathrooms);

    const numericParking =
      parking.trim() === "" ? 0 : Number(parking);

    if (
      !Number.isFinite(numericBedrooms) ||
      numericBedrooms < 0 ||
      numericBedrooms > 100 ||
      !Number.isInteger(numericBedrooms)
    ) {
      showError(
        "Invalid Bedrooms",
        "Please enter a valid number of bedrooms."
      );
      return;
    }

    if (
      !Number.isFinite(numericBathrooms) ||
      numericBathrooms < 0 ||
      numericBathrooms > 100
    ) {
      showError(
        "Invalid Bathrooms",
        "Please enter a valid number of bathrooms."
      );
      return;
    }

    if (
      !Number.isFinite(numericParking) ||
      numericParking < 0 ||
      numericParking > 100 ||
      !Number.isInteger(numericParking)
    ) {
      showError(
        "Invalid Parking",
        "Please enter a valid number of parking spaces."
      );
      return;
    }

    // --------------------------------------------------
    // OPTIONAL NUMBER VALIDATION
    // --------------------------------------------------

    function parseOptionalNumber(value: string): number | null {
      if (!value.trim()) {
        return null;
      }

      const parsed = Number(value);

      if (!Number.isFinite(parsed)) {
        return null;
      }

      return parsed;
    }

    const numericDeposit = parseOptionalNumber(deposit);
    const numericFloorSize = parseOptionalNumber(floorSize);
    const numericLandSize = parseOptionalNumber(landSize);
    const numericRates = parseOptionalNumber(rates);
    const numericLevies = parseOptionalNumber(levies);

    const optionalNumbers = [
      {
        label: "deposit",
        raw: deposit,
        value: numericDeposit,
      },
      {
        label: "floor size",
        raw: floorSize,
        value: numericFloorSize,
      },
      {
        label: "land size",
        raw: landSize,
        value: numericLandSize,
      },
      {
        label: "rates",
        raw: rates,
        value: numericRates,
      },
      {
        label: "levies",
        raw: levies,
        value: numericLevies,
      },
    ];

    for (const field of optionalNumbers) {
      if (
        field.raw.trim() &&
        (field.value === null || field.value < 0)
      ) {
        showError(
          "Invalid Property Details",
          `Please enter a valid ${field.label}.`
        );
        return;
      }
    }

    // --------------------------------------------------
    // PHONE VALIDATION
    // --------------------------------------------------

    const cleanPhone = phoneNumber
      .trim()
      .replace(/[\s()-]/g, "");

    const phoneRegex = /^(?:\+27|27|0)[6-8][0-9]{8}$/;

    if (!cleanPhone) {
      showError(
        "Phone Number Required",
        "Please enter a South African contact number."
      );
      return;
    }

    if (!phoneRegex.test(cleanPhone)) {
      showError(
        "Invalid Phone Number",
        "Please enter a valid South African mobile number, for example 0821234567 or +27821234567."
      );
      return;
    }

    // --------------------------------------------------
    // IMAGE VALIDATION
    // --------------------------------------------------

    if (images.length === 0) {
      showError(
        "Photos Required",
        "Please upload at least one property photo."
      );
      return;
    }

    if (images.length > 20) {
      showError(
        "Too Many Photos",
        "You can upload a maximum of 20 property photos."
      );
      return;
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    for (const image of images) {
      if (!allowedImageTypes.includes(image.type)) {
        showError(
          "Invalid Photo",
          "Only JPG, PNG and WebP property photos are allowed."
        );
        return;
      }

      if (image.size > 10 * 1024 * 1024) {
        showError(
          "Photo Too Large",
          `${image.name} is larger than 10 MB. Please choose a smaller image.`
        );
        return;
      }
    }

    setPublishing(true);

    try {
      // --------------------------------------------------
      // DUPLICATE PRE-CHECK
      // --------------------------------------------------
      //
      // This is only for a nicer user experience.
      // The UNIQUE database index remains the real protection.

      const {
        data: possibleDuplicate,
        error: duplicateCheckError,
      } = await supabase
        .from("properties")
        .select("id")
        .eq("user_id", user.id)
        .ilike("title", cleanTitle)
        .ilike("city", city.trim())
        .ilike("street_address", address.trim())
        .eq("price", numericPrice)
        .eq("listing_type", listingType)
        .limit(1)
        .maybeSingle();

      if (duplicateCheckError) {
        console.warn(
          "Duplicate pre-check could not be completed:",
          duplicateCheckError
        );
      }

      if (possibleDuplicate) {
        showError(
          "Property Already Listed",
          "This property appears to already be listed on HomeLinker. Please check your dashboard before posting it again."
        );
        return;
      }

      // --------------------------------------------------
      // UPLOAD IMAGES
      // --------------------------------------------------

      let imageUrl = "";
      const imageUrls: string[] = [];
      const uploadedPaths: string[] = [];

      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      for (const image of images) {
        let imageToUpload = image;

        try {
          imageToUpload = await imageCompression(
            image,
            compressionOptions
          );
        } catch (compressionError) {
          console.error(
            "Image compression failed:",
            compressionError
          );
        }

        const safeOriginalName = image.name
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .slice(-100);

        const fileName =
          `${user.id}/${crypto.randomUUID()}-${safeOriginalName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("property-images")
            .upload(fileName, imageToUpload, {
              upsert: false,
              contentType: imageToUpload.type,
            });

        if (uploadError) {
          console.error(
            "Property image upload error:",
            uploadError
          );

          if (uploadedPaths.length > 0) {
            await supabase.storage
              .from("property-images")
              .remove(uploadedPaths);
          }

          showError(
            "Upload Failed",
            "One of your property photos could not be uploaded. Please try again."
          );
          return;
        }

        uploadedPaths.push(fileName);

        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);
      }

      imageUrl = imageUrls[0];

      // --------------------------------------------------
      // GET AUTHENTICATED SESSION
      // --------------------------------------------------

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.error(
          "Listing session error:",
          sessionError
        );

        if (uploadedPaths.length > 0) {
          await supabase.storage
            .from("property-images")
            .remove(uploadedPaths);
        }

        showError(
          "Session Expired",
          "Please sign in again before posting your property."
        );
        return;
      }

      // --------------------------------------------------
      // CREATE PENDING PROPERTY
      // --------------------------------------------------
      //
      // The trusted API creates this listing as pending.
      // The browser cannot choose status, plan, payment
      // status, featured or promotion fields.

      const createResponse = await fetch(
        "/api/create-listing",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            listing_type: listingType,
            property_type: propertyType.trim(),

            title: cleanTitle,
            description: cleanDescription,

            province: province.trim(),
            city: city.trim(),
            suburb: suburb.trim(),

            street_address: address.trim(),

            latitude,
            longitude,

            price: numericPrice,

            bedrooms: numericBedrooms,
            bathrooms: numericBathrooms,
            parking: numericParking,

            deposit: numericDeposit,

            available_from:
              availableFrom || null,

            floor_size: numericFloorSize,
            land_size: numericLandSize,

            condition:
              condition.trim() || null,

            rates: numericRates,
            levies: numericLevies,

            furnished,
            pet_friendly: petFriendly,

            image_url: imageUrl,
            image_urls: imageUrls,

            contact_phone: cleanPhone,
          }),
        }
      );

      let createData: {
        success?: boolean;
        propertyId?: number;
        status?: string;
        error?: string;
        code?: string;
      } = {};

      try {
        createData =
          await createResponse.json();
      } catch {
        createData = {};
      }

      if (
        !createResponse.ok ||
        !createData.propertyId
      ) {
        console.error(
          "Create listing API error:",
          createData
        );

        // The listing was not created, so remove the
        // newly uploaded unused photos.
        if (uploadedPaths.length > 0) {
          await supabase.storage
            .from("property-images")
            .remove(uploadedPaths);
        }

        if (
          createData.code ===
          "DUPLICATE_LISTING"
        ) {
          showError(
            "Property Already Listed",
            createData.error ||
              "This property is already listed on HomeLinker. Please check your dashboard instead of posting it again."
          );
          return;
        }

        showError(
          "Something Went Wrong",
          createData.error ||
            "Your property could not be created. Please check your information and try again."
        );
        return;
      }

      const propertyId = createData.propertyId;

      // --------------------------------------------------
      // SAVE PROPERTY ID
      // --------------------------------------------------

      sessionStorage.setItem(
        "propertyId",
        String(propertyId)
      );

      // --------------------------------------------------
      // CHOOSE LISTING PLAN
      // --------------------------------------------------
      //
      // The property remains pending/private here.
      // The pricing flow determines how it is activated.

      router.push(
        `/pricing?propertyId=${propertyId}`
      );
    } catch (err: unknown) {
      console.error(
        "Unexpected listing error:",
        err
      );

      showError(
        "Unexpected Error",
        "Something unexpected happened while creating your listing. Please try again."
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-12">
      {/* SUCCESS / ERROR POPUP */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-5xl ${
                popup.type === "success"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {popup.type === "success" ? "✅" : "❌"}
            </div>

            <h2 className="mt-6 text-center text-3xl font-black text-[#111111]">
              {popup.title}
            </h2>

            <p className="mt-3 text-center text-[#666666]">
              {popup.message}
            </p>

            <button
              type="button"
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
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black text-[#111111]">
            Create Listing
          </h1>

          <p className="mt-4 text-[#555555]">
            List your property on HomeLinker
          </p>
        </div>

        {/* PROGRESS */}
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
            <span>Step {step} of 7</span>

            <span>
              {Math.round(((step - 1) / 6) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <ListingTypeStep
            listingType={listingType}
            setListingType={setListingType}
            onNext={() => setStep(2)}
          />
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <PropertyTypeStep
            listingType={listingType as "rent" | "sale"}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {/* STEP 3 */}
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

        {/* STEP 4 */}
        {step === 4 && (
          <PropertyDetailsStep
            listingType={listingType as "rent" | "sale"}
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

        {/* STEP 5 */}
        {step === 5 && (
          <PhotosStep
            images={images}
            setImages={setImages}
            onBack={() => setStep(4)}
            onNext={() => setStep(6)}
          />
        )}

        {/* STEP 6 */}
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

        {/* STEP 7 */}
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

        {publishing && step === 7 && (
          <div className="mt-6 rounded-2xl border border-[#E8D9A8] bg-white p-4 text-center font-semibold text-[#555555]">
            Creating your listing…
          </div>
        )}
      </div>
    </main>
  );
}