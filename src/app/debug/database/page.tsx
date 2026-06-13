"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Building2, AlertTriangle, CheckCircle, RefreshCw, Shield, ArrowRight, Server, Cpu, Database } from "lucide-react";
import Link from "next/link";

function DebugPageContent() {
  const searchParams = useSearchParams();
  const isDebug = searchParams.get("debug") === "true";
  
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<"connecting" | "success" | "error">("connecting");
  const [propertiesCount, setPropertiesCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [queryStatus, setQueryStatus] = useState("");
  
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || "N/A";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const hostName = supabaseUrl ? new URL(supabaseUrl).hostname : "None";
  const urlDefined = !!supabaseUrl;
  const keyDefined = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function checkDb() {
    setLoading(true);
    setDbStatus("connecting");
    setErrorMsg("");
    setQueryStatus("Pending");
    try {
      const { data, error, status, statusText } = await supabase
        .from("properties")
        .select("id");
      
      if (error) {
        setDbStatus("error");
        setErrorMsg(error.message);
        setQueryStatus(`${status || "Failed"} - ${statusText || error.code}`);
        setPropertiesCount(null);
      } else {
        setDbStatus("success");
        setPropertiesCount(data?.length || 0);
        setQueryStatus(`${status || 200} - ${statusText || "OK"}`);
      }
    } catch (e: any) {
      setDbStatus("error");
      setErrorMsg(e.message || String(e));
      setQueryStatus("Exception Thrown");
      setPropertiesCount(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isDebug) {
      checkDb();
    }
  }, [isDebug]);

  if (!isDebug) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-950/40 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <Shield size={28} className="stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold tracking-tight uppercase text-gray-100">Telemetry Restricted</h1>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Access to this telemetry panel requires an active debug query flag. Contact system administrator for details.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red border-b border-brand-red pb-0.5 hover:text-white hover:border-white transition-colors">
              Return to Homepage <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-850 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-brand-red shadow-inner">
              <Cpu size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-[0.25em] text-brand-red">NexHouz Registry</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Core Telemetry & Connection Audit</p>
            </div>
          </div>
          <button
            onClick={checkDb}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Re-Evaluating..." : "Refresh Status"}</span>
          </button>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Connection */}
          <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Database Connection</span>
              <Database size={15} className="text-gray-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full relative flex`}>
                {dbStatus === "connecting" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                )}
                {dbStatus === "success" && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500"></span>
                )}
                {dbStatus === "error" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                  dbStatus === "connecting" ? "bg-amber-500" :
                  dbStatus === "success" ? "bg-emerald-500" : "bg-red-500"
                }`}></span>
              </div>
              <span className="text-lg font-black uppercase tracking-wide">
                {dbStatus === "connecting" ? "Connecting" : dbStatus === "success" ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Card 2: Property Count */}
          <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Database Listings</span>
              <Building2 size={15} className="text-gray-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-100">
                {propertiesCount !== null ? propertiesCount : "—"}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Live properties count</p>
            </div>
          </div>

          {/* Card 3: Environment */}
          <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Build environment</span>
              <Server size={15} className="text-gray-500" />
            </div>
            <div>
              <p className="text-lg font-black uppercase text-gray-200">
                {process.env.NODE_ENV}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-2.5">
                Next.js Mode
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Configuration Information */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-800 pb-3">Runtime Audit Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-850">
              <span className="text-gray-400 font-medium">Supabase Hostname</span>
              <span className="font-mono font-bold text-gray-200">{hostName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-850">
              <span className="text-gray-400 font-medium">Supabase URL Configured</span>
              <span className={`font-bold ${urlDefined ? "text-emerald-500" : "text-red-500"}`}>
                {urlDefined ? "YES" : "NO"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-850">
              <span className="text-gray-400 font-medium">Anon Key Configured</span>
              <span className={`font-bold ${keyDefined ? "text-emerald-500" : "text-red-500"}`}>
                {keyDefined ? "YES" : "NO"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-850">
              <span className="text-gray-400 font-medium">Build Date / Timestamp</span>
              <span className="font-mono text-gray-300 font-bold">{buildTime}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-850 md:col-span-2">
              <span className="text-gray-400 font-medium">Last Supabase HTTP Query Status</span>
              <span className={`font-mono font-bold ${dbStatus === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {queryStatus}
              </span>
            </div>
          </div>

          {/* Database Error Logs Output */}
          {errorMsg && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <AlertTriangle size={12} />
                <span>Live Query Exception Console</span>
              </span>
              <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 font-mono text-xs text-red-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {errorMsg}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <div className="text-center pt-12 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
        NexHouz Core Registry Audit Panel · Temporary Verification Tool
      </div>
    </div>
  );
}

export default function DebugDatabasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DebugPageContent />
    </Suspense>
  );
}
