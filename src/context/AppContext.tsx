import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, SavedResponse } from "../lib/api";
import { CollegeSummary } from "../types";

interface AppContextType {
  // Navigation & Active View
  activeView: "colleges" | "detail" | "compare" | "predictor" | "saved";
  selectedCollegeSlug: string | null;
  navigateTo: (view: "colleges" | "detail" | "compare" | "predictor" | "saved", slug?: string) => void;

  // Comparison Tray
  comparedColleges: CollegeSummary[];
  addToCompare: (college: CollegeSummary) => boolean;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isComparing: (collegeId: string) => boolean;

  // Saved / Shortlist
  savedData: SavedResponse | undefined;
  isSaved: (collegeId: string) => boolean;
  toggleSaveCollege: (college: CollegeSummary) => void;
  deleteSavedComparison: (id: string) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<"colleges" | "detail" | "compare" | "predictor" | "saved">("colleges");
  const [selectedCollegeSlug, setSelectedCollegeSlug] = useState<string | null>(null);
  const [comparedColleges, setComparedColleges] = useState<CollegeSummary[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync URL hash or history if applicable
  const navigateTo = (view: "colleges" | "detail" | "compare" | "predictor" | "saved", slug?: string) => {
    setActiveView(view);
    if (slug) {
      setSelectedCollegeSlug(slug);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Query Saved Items from Server
  const { data: savedData } = useQuery({
    queryKey: ["savedItems"],
    queryFn: api.getSavedItems,
    staleTime: 60 * 1000,
  });

  // Mutation: Save College
  const saveCollegeMutation = useMutation({
    mutationFn: api.saveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedItems"] });
      showToast("College shortlisted successfully");
    },
  });

  // Mutation: Remove College
  const removeCollegeMutation = useMutation({
    mutationFn: api.removeSavedCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedItems"] });
      showToast("Removed from shortlist");
    },
  });

  // Mutation: Remove Comparison
  const removeComparisonMutation = useMutation({
    mutationFn: api.removeSavedComparison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedItems"] });
      showToast("Comparison deleted");
    },
  });

  const isSaved = (collegeId: string): boolean => {
    return savedData?.savedCollegeIds?.includes(collegeId) || false;
  };

  const toggleSaveCollege = (college: CollegeSummary) => {
    if (isSaved(college.id)) {
      removeCollegeMutation.mutate(college.id);
    } else {
      saveCollegeMutation.mutate(college.id);
    }
  };

  const deleteSavedComparison = (id: string) => {
    removeComparisonMutation.mutate(id);
  };

  // Compare Tray Logic
  const addToCompare = (college: CollegeSummary): boolean => {
    if (comparedColleges.some((c) => c.id === college.id)) {
      removeFromCompare(college.id);
      return false;
    }
    if (comparedColleges.length >= 3) {
      showToast("You can compare maximum 3 colleges at once");
      return false;
    }
    setComparedColleges((prev) => [...prev, college]);
    showToast(`Added ${college.name.split("(")[0].trim()} to comparison`);
    return true;
  };

  const removeFromCompare = (collegeId: string) => {
    setComparedColleges((prev) => prev.filter((c) => c.id !== collegeId));
  };

  const clearCompare = () => {
    setComparedColleges([]);
  };

  const isComparing = (collegeId: string): boolean => {
    return comparedColleges.some((c) => c.id === collegeId);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        selectedCollegeSlug,
        navigateTo,
        comparedColleges,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        savedData,
        isSaved,
        toggleSaveCollege,
        deleteSavedComparison,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
