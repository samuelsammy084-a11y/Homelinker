"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

type FavoriteButtonProps = {
  propertyId: number;
  className?: string;
};

export default function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadState() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("favorites")
        .select("property_id")
        .eq("user_id", currentUser.id)
        .eq("property_id", propertyId)
        .maybeSingle();

      setIsFavorite(Boolean(data));
      setLoading(false);
    }

    loadState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [propertyId]);

  async function toggleFavorite() {
    if (!user) {
      alert("Please sign in to save favorites.");
      return;
    }

    setLoading(true);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);

      if (!error) {
        setIsFavorite(false);
      }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        property_id: propertyId,
      });

      if (!error) {
        setIsFavorite(true);
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={className ?? "rounded-full border border-slate-200 bg-white/90 p-2 text-[#C9A227] shadow transition hover:scale-105 hover:bg-white"}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={loading}
    >
      <Heart
        size={20}
        className={isFavorite ? "fill-[#C9A227] text-[#C9A227]" : "text-slate-600"}
      />
    </button>
  );
}
