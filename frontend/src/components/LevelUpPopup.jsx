import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function LevelUpPopup() {
  // If you want to trigger popup from context, add a state like levelUp in AuthContext
  const { user } = useAuth();

  // simple demo: show when level >=5 (or integrate real trigger)
  if (!user) return null;

  // show nothing by default — you can add logic to display when leveledUp is true
  return null;
}
