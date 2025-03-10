import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TradeProvider } from "./contexts/TradeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppLayout } from "./components/layout/AppLayout";

// Pages
import Index from "./pages/Index";
import TradesPage from "./pages/TradesPage";
import AddTradePage from "./pages/AddTradePage";
import TradeDetailPage from "./pages/TradeDetailPage";
import AnalysisPage from "./pages/AnalysisPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TradeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout><Index /></AppLayout>} />
              <Route path="/trades" element={<AppLayout><TradesPage /></AppLayout>} />
              <Route path="/trades/:id" element={<AppLayout><TradeDetailPage /></AppLayout>} />
              <Route path="/add-trade" element={<AppLayout><AddTradePage /></AppLayout>} />
              <Route path="/analysis" element={<AppLayout><AnalysisPage /></AppLayout>} />
              <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TradeProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
