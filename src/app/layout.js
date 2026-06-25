import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import HeaderWrapper from "./HeaderWrapper";
import BottomNavigation from "@/components/BottomNavigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "YUSUR Marketplace",
  description: "Digital Healthcare Multi-Vendor Marketplace"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div id="app-shell">
            <HeaderWrapper />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
            <BottomNavigation />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
