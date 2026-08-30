import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { CompareTray } from "./components/CompareTray";
import { CollegeListing } from "./components/CollegeListing";
import { CollegeDetail } from "./components/CollegeDetail";
import { CompareView } from "./components/CompareView";
import { PredictorView } from "./components/PredictorView";
import { SavedItemsView } from "./components/SavedItemsView";
import { Compass, CheckCircle2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const MainContent: React.FC = () => {
  const { activeView, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 bento-pattern-bg text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-3 duration-200 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header />

      {/* View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28">
        {activeView === "colleges" && <CollegeListing />}
        {activeView === "detail" && <CollegeDetail />}
        {activeView === "compare" && <CompareView />}
        {activeView === "predictor" && <PredictorView />}
        {activeView === "saved" && <SavedItemsView />}
      </main>

      {/* Floating Compare Tray */}
      <CompareTray />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">CollegeCompass</span>
            <span className="text-slate-300">•</span>
            <span>All-India Admissions, Cutoff Predictors & NIRF Placement Insights</span>
          </div>
          <div className="text-slate-400">
            Data sourced from official counseling authorities (JoSAA, CSAB, MCC) and verified alumni.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </QueryClientProvider>
  );
}
