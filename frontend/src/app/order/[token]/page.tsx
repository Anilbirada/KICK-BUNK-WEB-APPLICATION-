"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  Smartphone, UtensilsCrossed, ShieldCheck 
} from "lucide-react";
import { api } from "../../../lib/api";
import { useTableSession } from "../../../context/TableSessionContext";

export default function TableQrLandingPage() {
  const params = useParams();
  const router = useRouter();
  const rawToken = params?.token as string;
  const { setTableSession } = useTableSession();

  const [status, setStatus] = useState<"VALIDATING" | "APP_CHECK" | "SUCCESS" | "ERROR">("VALIDATING");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [tableData, setTableData] = useState<any>(null);

  useEffect(() => {
    async function processQrScan() {
      if (!rawToken) return;

      try {
        let tokenToValidate = rawToken;

        // Convenience demo shortcut for testing table 08
        if (rawToken === "sample-table-08") {
          // Fetch Bengaluru outlet tables to find table 08's token
          const restaurant = await api.getRestaurant();
          const blrOutlet = restaurant.outlets.find((o: any) => o.code === "KB-BLR-01");
          if (blrOutlet) {
            const qrInfo = await api.generateTableQr(blrOutlet.id, "08");
            tokenToValidate = qrInfo.token;
          }
        }

        // 1. Cryptographic Validation
        const res = await api.validateQrToken(tokenToValidate);

        if (!res.is_valid) {
          setStatus("ERROR");
          setErrorMessage(res.message || "Invalid or tampered table QR token.");
          return;
        }

        setTableData(res);
        setStatus("APP_CHECK");

        // 2. Persist Table Context in Session & Storage
        setTableSession({
          tableNumber: res.table_number,
          tableId: res.table_id,
          outletId: res.outlet_id,
          outletName: res.outlet_name,
          outletCode: res.outlet_code,
          diningArea: res.dining_area,
          sessionToken: res.session_token,
          alcoholServiceEnabled: res.alcohol_service_enabled,
          legalDrinkingAge: res.legal_drinking_age,
          isDineInActive: true,
        });

        // 3. Native App Deep Link Interception Attempt
        // If user has the app installed, custom scheme triggers native intent.
        // If not installed, page cleanly remains on responsive web app.
        const deepLinkUrl = `kickbunk://order/${tokenToValidate}`;
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = deepLinkUrl;
        document.body.appendChild(iframe);
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (_) {}
        }, 1500);

        // Transition to success state
        setStatus("SUCCESS");
      } catch (err: any) {
        setStatus("ERROR");
        setErrorMessage(err.message || "Failed to validate QR code. Please ask floor staff.");
      }
    }

    processQrScan();
  }, [rawToken, setTableSession]);

  const proceedToMenu = () => {
    router.push("/menu");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF8F2]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-[#E7DFD3] p-6 sm:p-8 text-center space-y-6">
        {/* Brand Crest with Official Logo */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#FAF8F2] p-2 border-2 border-[#C5A46D] flex items-center justify-center shadow-sm">
          <img src="/logo.png" alt="KICK BUNK" className="w-full h-full object-contain" />
        </div>

        {status === "VALIDATING" && (
          <div className="space-y-4 py-6">
            <div className="w-10 h-10 border-3 border-[#C5A46D] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-[#382D25]">
              Connecting to Table...
            </h2>
            <p className="text-xs text-[#77716A]">
              Validating cryptographic HMAC token and table assignment...
            </p>
          </div>
        )}

        {status === "ERROR" && (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-red-900">
              QR Verification Failed
            </h2>
            <p className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
              {errorMessage}
            </p>
            <p className="text-xs text-[#77716A]">
              Please ensure you are scanning an active table QR code placed inside KICK BUNK.
            </p>
            <a
              href="/menu"
              className="inline-block py-3 px-6 rounded-2xl bg-[#382D25] text-[#FAF8F2] font-semibold text-xs uppercase tracking-wider shadow-md"
            >
              Browse General Menu
            </a>
          </div>
        )}

        {status === "SUCCESS" && tableData && (
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F2] text-emerald-800 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Table Verified & Connected</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66A4B] block">
                WELCOME TO KICK BUNK
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#382D25] mt-1">
                Table {tableData.table_number}
              </h2>
              <div className="mt-2 text-xs text-[#77716A] font-medium space-y-0.5">
                <span className="block font-bold text-[#382D25]">{tableData.outlet_name}</span>
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#F0E9DC] text-[#382D25] font-semibold text-[11px] mt-1">
                  Section: {tableData.dining_area}
                </span>
              </div>
            </div>

            {/* Smart App Detection / Web Ordering Notice */}
            <div className="bg-[#FAF8F2] rounded-2xl p-4 border border-[#E7DFD3] text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#382D25] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
                <span>Zero-Download Instant Table Ordering</span>
              </div>
              <p className="text-[#77716A] leading-relaxed text-[11px]">
                Enjoy full digital dining from your phone. Select items, customize dishes, and order directly to our kitchen & bar!
              </p>
            </div>

            <button
              onClick={proceedToMenu}
              className="w-full py-4 px-6 rounded-2xl bg-[#382D25] hover:bg-[#251E19] text-[#FAF8F2] font-semibold text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Explore Digital Menu & Order</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
