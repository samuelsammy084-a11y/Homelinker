"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] =
    useState("");
  const [province, setProvince] =
    useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] =
    useState("");
  const [bathrooms, setBathrooms] =
    useState("");
  const [parking, setParking] =
    useState("");
  const [contactNumber, setContactNumber] =
    useState("");

  const [
    showContactPhone,
    setShowContactPhone,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);
  const [loadingProperty, setLoadingProperty] =
    useState(true);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white p-4 text-black placeholder:text-gray-500 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  const loadProperty = useCallback(async () => {
    if (!id) {
      return;
    }

    setLoadingProperty(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      /*
       * Only fetch public-safe listing fields here.
       *
       * Do NOT use select("*").
       */
      const {
        data,
        error,
      } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          description,
          price,
          property_type,
          province,
          city,
          bedrooms,
          bathrooms,
          parking,
          user_id
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(
          "EDIT PROPERTY FETCH ERROR:",
          error
        );

        alert(
          "Unable to load this property."
        );

        router.replace("/dashboard");
        return;
      }

      if (!data) {
        alert(
          "Property not found or you do not have permission to edit it."
        );

        router.replace("/dashboard");
        return;
      }

      /*
       * Load private contact information through
       * the owner-only SECURITY DEFINER function.
       */
      const {
        data: contactRows,
        error: contactError,
      } = await supabase.rpc(
        "get_my_property_contact",
        {
          p_property_id: Number(id),
        }
      );

      if (contactError) {
        console.error(
          "OWNER CONTACT FETCH ERROR:",
          contactError
        );
      }

      const contact = Array.isArray(contactRows)
        ? contactRows[0]
        : contactRows;

      /*
       * Every setter handles NULL safely.
       *
       * This prevents null/default values from
       * breaking controlled inputs.
       */
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");

      setPrice(
        data.price != null
          ? String(data.price)
          : ""
      );

      setPropertyType(
        data.property_type ?? ""
      );

      setProvince(data.province ?? "");
      setCity(data.city ?? "");

      setBedrooms(
        data.bedrooms != null
          ? String(data.bedrooms)
          : ""
      );

      setBathrooms(
        data.bathrooms != null
          ? String(data.bathrooms)
          : ""
      );

      setParking(
        data.parking != null
          ? String(data.parking)
          : ""
      );

      setContactNumber(
        contact?.contact_phone ??
          contact?.contact_number ??
          ""
      );

      setShowContactPhone(
        contact?.show_contact_phone === true
      );
    } catch (error) {
      console.error(
        "EDIT PROPERTY LOAD ERROR:",
        error
      );

      alert(
        "Unable to load this property."
      );
    } finally {
      setLoadingProperty(false);
    }
  }, [id, router]);

  useEffect(() => {
    void loadProperty();
  }, [loadProperty]);

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!id || loading) {
      return;
    }

    const cleanTitle = title.trim();
    const cleanDescription =
      description.trim();
    const cleanProvince =
      province.trim();
    const cleanCity = city.trim();
    const cleanContactNumber =
      contactNumber.trim();

    const numericPrice = Number(price);

    if (!cleanTitle) {
      alert("Please enter a property title.");
      return;
    }

    if (!cleanDescription) {
      alert("Please enter a description.");
      return;
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (!propertyType) {
      alert("Please select a property type.");
      return;
    }

    if (!cleanProvince || !cleanCity) {
      alert(
        "Please enter the province and city."
      );
      return;
    }

    if (!cleanContactNumber) {
      alert(
        "Please enter a contact number."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const optionalNumber = (
        value: string
      ) => {
        if (!value.trim()) {
          return null;
        }

        const parsed = Number(value);

        return Number.isFinite(parsed)
          ? parsed
          : null;
      };

      const {
        error,
      } = await supabase
        .from("properties")
        .update({
          title: cleanTitle,

          description:
            cleanDescription,

          price: numericPrice,

          property_type:
            propertyType,

          province:
            cleanProvince,

          city:
            cleanCity,

          location:
            `${cleanCity}, ${cleanProvince}`,

          bedrooms:
            optionalNumber(bedrooms),

          bathrooms:
            optionalNumber(bathrooms),

          parking:
            optionalNumber(parking),

          /*
           * Keep both legacy phone columns
           * synchronized for now.
           */
          contact_phone:
            cleanContactNumber,

          contact_number:
            cleanContactNumber,

          show_contact_phone:
            showContactPhone,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "EDIT PROPERTY UPDATE ERROR:",
          error
        );

        alert(error.message);
        return;
      }

      alert(
        "🎉 Property updated successfully!"
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(
        "EDIT PROPERTY UPDATE ERROR:",
        error
      );

      alert(
        "Unable to update this property."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingProperty) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-12 text-center shadow-xl">
          <p className="font-semibold text-black">
            Loading property...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-4xl font-bold text-black">
          Edit Property
        </h1>

        <p className="mb-8 text-sm text-gray-600">
          Update your listing information below.
        </p>

        <form
          onSubmit={handleUpdate}
          className="space-y-6"
        >
          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Property Title"
            className={inputClass}
            required
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={5}
            placeholder="Description"
            className={inputClass}
            required
          />

          <div className="grid gap-6 md:grid-cols-2">
            <input
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              className={inputClass}
              required
            />

            <select
              value={propertyType}
              onChange={(e) =>
                setPropertyType(
                  e.target.value
                )
              }
              className={inputClass}
              required
            >
              <option value="">
                Property Type
              </option>
              <option value="Room">
                Room
              </option>
              <option value="Bachelor">
                Bachelor
              </option>
              <option value="Apartment">
                Apartment
              </option>
              <option value="House">
                House
              </option>
              <option value="Townhouse">
                Townhouse
              </option>
            </select>

            <select
              value={province}
              onChange={(e) =>
                setProvince(
                  e.target.value
                )
              }
              className={inputClass}
              required
            >
              <option value="">
                Province
              </option>
              <option value="Gauteng">
                Gauteng
              </option>
              <option value="Western Cape">
                Western Cape
              </option>
              <option value="KwaZulu-Natal">
                KwaZulu-Natal
              </option>
              <option value="Eastern Cape">
                Eastern Cape
              </option>
              <option value="Free State">
                Free State
              </option>
              <option value="Limpopo">
                Limpopo
              </option>
              <option value="Mpumalanga">
                Mpumalanga
              </option>
              <option value="North West">
                North West
              </option>
              <option value="Northern Cape">
                Northern Cape
              </option>
            </select>

            <input
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              placeholder="City"
              className={inputClass}
              required
            />

            <input
              value={bedrooms}
              onChange={(e) =>
                setBedrooms(
                  e.target.value
                )
              }
              type="number"
              min="0"
              placeholder="Bedrooms"
              className={inputClass}
            />

            <input
              value={bathrooms}
              onChange={(e) =>
                setBathrooms(
                  e.target.value
                )
              }
              type="number"
              min="0"
              step="0.5"
              placeholder="Bathrooms"
              className={inputClass}
            />

            <input
              value={parking}
              onChange={(e) =>
                setParking(
                  e.target.value
                )
              }
              type="number"
              min="0"
              placeholder="Parking Spaces"
              className={inputClass}
            />

            <input
              value={contactNumber}
              onChange={(e) =>
                setContactNumber(
                  e.target.value
                )
              }
              type="tel"
              placeholder="Contact Number"
              className={inputClass}
              required
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E8D8A5] bg-[#FCFAF5] p-4">
            <input
              type="checkbox"
              checked={showContactPhone}
              onChange={(e) =>
                setShowContactPhone(
                  e.target.checked
                )
              }
              className="mt-1 h-4 w-4 accent-[#C9A227]"
            />

            <span>
              <span className="block font-semibold text-black">
                Show my phone number publicly
              </span>

              <span className="mt-1 block text-sm text-gray-600">
                When enabled, visitors can use
                the Call and WhatsApp options on
                this property listing.
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Updating..."
              : "Update Property"}
          </button>
        </form>
      </div>
    </main>
  );
}