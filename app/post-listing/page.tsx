"use client";

import { useState } from "react";

import ListingTypeStep from "./components/ListingTypeStep";
import PropertyTypeStep from "./components/PropertyTypeStep";
import LocationStep from "./components/LocationStep";
import PropertyDetailsStep from "./components/PropertyDetailsStep";
import PhotosStep from "./components/PhotosStep";
import DescriptionStep from "./components/DescriptionStep";
import ReviewStep from "./components/ReviewStep";

export default function PostListingPage() {
  const [step, setStep] = useState(1);

  // STEP 1
  const [listingType, setListingType] = useState<"rent" | "sale" | "">("");

  // STEP 2
  const [propertyType, setPropertyType] = useState("");

  // STEP 3
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [suburb, setSuburb] = useState("");
  const [address, setAddress] = useState("");

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

  function publishListing() {
    alert("Next we will save everything to Supabase 🚀");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-12 px-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black text-[#111111]">
            Create Listing
          </h1>

          <p className="mt-4 text-[#555555]">
            List your property on HomeLinker
          </p>
        </div>

        {/* Progress */}

        <div className="mb-10">

          <div className="mb-2 flex justify-between text-sm text-[#555555]">
            <span>Step {step} of 7</span>

            <span>{Math.round((step / 7) * 100)}%</span>
          </div>

          <div className="h-3 rounded-full bg-[#F3E8BE]">

            <div
              className="h-full rounded-full bg-[#C9A227] transition-all duration-500"
              style={{
                width: `${(step / 7) * 100}%`,
              }}
            />

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
            listingType={listingType as "rent" | "sale"}
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
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

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
            images={images}
            onBack={() => setStep(6)}
            onPublish={publishListing}
          />
        )}

      </div>
    </main>
  );
}