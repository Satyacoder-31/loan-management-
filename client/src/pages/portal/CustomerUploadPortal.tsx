import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  FileText,
  Camera,
  AlertCircle,
  FileCheck,
  Building2,
  Lock,
  ArrowRight,
  RefreshCw,
  Eye,
  X,
  PhoneCall,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface ApplicantInfo {
  id: number;
  ref: string;
  name: string;
  masked_mobile: string;
  loan_type: string;
  loan_amount: number;
  employment_type: string;
  city?: string;
  submitted: boolean;
  submitted_at?: string | null;
}

interface ChecklistItem {
  doc_type: string;
  title: string;
  desc: string;
  category: string;
  required: boolean;
  accept: string;
  is_selfie?: boolean;
}

interface UploadedDoc {
  id: number;
  doc_type: string;
  name: string;
  status: string;
  file_url?: string;
  created_at: string;
}

export default function CustomerUploadPortal() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicant, setApplicant] = useState<ApplicantInfo | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // File input refs map
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const cameraInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/customer-upload/${id}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Unable to load document portal for this applicant.");
      }
      const data = await res.json();
      setApplicant(data.applicant);
      setChecklist(data.checklist || []);
      setUploadedDocs(data.uploaded_docs || []);
      if (data.applicant?.submitted) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load verification portal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const isDocTypeMatch = (a?: string, b?: string) => {
    if (!a || !b) return false;
    if (a === b) return true;
    if ((a === "form_16" || a === "form16") && (b === "form_16" || b === "form16")) return true;
    if ((a === "salary_slip" || a === "payment_slip") && (b === "salary_slip" || b === "payment_slip")) return true;
    return false;
  };

  const handleFileSelected = async (docType: string, file: File) => {
    if (!file || !id) return;

    // Check size limit (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB limit. Please upload a smaller file or compressed PDF.");
      return;
    }

    try {
      setUploadingType(docType);

      // Convert file to base64 data URI
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const res = await fetch(`/api/customer-upload/${id}/doc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_type: docType,
          name: file.name,
          file_data: base64Data,
          mime_type: file.type
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Upload failed. Please try again.");
      }

      const data = await res.json();
      if (data.doc) {
        setUploadedDocs((prev) => {
          const filtered = prev.filter((d) => !isDocTypeMatch(d.doc_type, docType));
          return [...filtered, data.doc];
        });
      }
    } catch (err: any) {
      alert(err.message || "Upload failed. Please try again.");
    } finally {
      setUploadingType(null);
    }
  };

  const handleCompleteSubmission = async () => {
    if (!id) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/customer-upload/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to complete submission.");
      }
      setIsSuccess(true);
    } catch (err: any) {
      alert(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations for progress
  const requiredList = checklist.filter((item) => item.required);
  const uploadedRequired = requiredList.filter((item) =>
    uploadedDocs.some((d) => isDocTypeMatch(d.doc_type, item.doc_type))
  );
  const totalUploaded = uploadedDocs.length;
  const progressPercent = requiredList.length > 0
    ? Math.round((uploadedRequired.length / requiredList.length) * 100)
    : 0;
  const canSubmit = requiredList.length > 0 && uploadedRequired.length === requiredList.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d1a] text-slate-200 flex flex-col items-center justify-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
          <RefreshCw className="w-7 h-7 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-white tracking-wide">Loading Secure Upload Portal…</h3>
        <p className="text-xs text-slate-400 mt-1">Verifying encrypted borrower session</p>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="min-h-screen bg-[#080d1a] text-slate-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-white">Upload Portal Link Unavailable</h2>
        <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
          {error || "This document upload link is invalid or has expired. Please contact your loan officer for a fresh link."}
        </p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-200 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header & Trust Badges */}
      <header className="sticky top-0 z-40 bg-[#0d1326]/90 backdrop-blur-md border-b border-[#18233e] px-4 py-3.5 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/30 text-sm">
              ⚡
            </div>
            <div>
              <div className="text-[13.5px] font-black tracking-tight text-white flex items-center gap-1.5">
                <span>SNIPER LENDING</span>
                <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Secure Portal
                </span>
              </div>
              <div className="text-[10.5px] text-slate-400 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Verification</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#131c33] px-2.5 py-1 rounded-lg border border-[#202d4f]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">RBI Regulated LOS</span>
            <span className="sm:hidden font-mono text-emerald-400">VERIFIED</span>
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-5 space-y-4.5">
        {isSuccess ? (
          /* Success Screen */
          <div className="rounded-3xl border border-[#1e2d52] bg-gradient-to-b from-[#111933] to-[#0c1329] p-7 text-center space-y-5 shadow-2xl mt-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Submission Complete
              </span>
              <h2 className="text-xl font-black text-white">Documents Submitted Successfully!</h2>
              <p className="text-[12.5px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{applicant.name}</strong>. Your documents have been securely delivered directly to your loan processing officer for verification.
              </p>
            </div>

            <div className="bg-[#090e1f] rounded-2xl border border-[#1a2647] p-4 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 border-b border-[#1a2647] pb-2">
                <span>Application Reference:</span>
                <span className="font-mono font-bold text-indigo-300">{applicant.ref}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-b border-[#1a2647] pb-2">
                <span>Loan Type:</span>
                <span className="font-semibold text-white">{applicant.loan_type}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Documents Uploaded:</span>
                <span className="font-bold text-emerald-400">{uploadedDocs.length} Verified Files</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Need to view or upload additional documents?
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Applicant Welcome & Loan Overview Card */}
            <div className="rounded-2xl border border-[#1b284a] bg-gradient-to-r from-[#121c38] via-[#0e162c] to-[#121c38] p-4.5 space-y-3 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>KYC & Document Verification Desk</span>
                  </div>
                  <h1 className="text-lg font-black text-white mt-0.5">
                    Welcome, {applicant.name}
                  </h1>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">
                    Registered Mobile: <span className="font-mono text-slate-300 font-semibold">{applicant.masked_mobile}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Ref No.</div>
                  <div className="font-mono text-xs font-bold text-indigo-300 bg-[#080d1d] px-2 py-0.5 rounded border border-[#1f2e54] mt-0.5">
                    {applicant.ref}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#1a2749] text-xs">
                <div className="bg-[#090e1f] p-2.5 rounded-xl border border-[#1a2749]">
                  <span className="text-[10.5px] text-slate-400 block">Requested Loan</span>
                  <span className="font-bold text-white text-[12.5px] mt-0.5 block">{applicant.loan_type}</span>
                </div>
                <div className="bg-[#090e1f] p-2.5 rounded-xl border border-[#1a2749]">
                  <span className="text-[10.5px] text-slate-400 block">Required Profile</span>
                  <span className="font-bold text-indigo-300 text-[12.5px] mt-0.5 block truncate">
                    {applicant.employment_type || "Self-employed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Progress Meter */}
            <div className="rounded-2xl border border-[#192647] bg-[#0c1327] p-4 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  <span>Document Progress</span>
                </div>
                <div className="text-[11px] font-bold text-slate-300">
                  <span className="text-emerald-400">{uploadedRequired.length}</span> of {requiredList.length} Mandatory Uploaded ({progressPercent}%)
                </div>
              </div>

              <div className="w-full bg-[#131c36] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#1c2b50]">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.max(progressPercent, 4)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{canSubmit ? "✓ Ready to submit" : "Upload all required documents to proceed"}</span>
                <span>{totalUploaded} Total Files</span>
              </div>
            </div>

            {/* Document Checklist Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-1">
                <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Required Documents Checklist</h3>
                <span className="text-[10.5px] text-slate-400">Photos or PDFs accepted (Max 15MB)</span>
              </div>

              {checklist.map((item, idx) => {
                const uploaded = uploadedDocs.find((d) => isDocTypeMatch(d.doc_type, item.doc_type));
                const isUploading = uploadingType === item.doc_type;

                return (
                  <div
                    key={item.doc_type}
                    className={`rounded-2xl border p-4 transition-all duration-200 shadow-md ${
                      uploaded
                        ? "border-emerald-500/40 bg-gradient-to-r from-[#0c182a] via-[#0d1629] to-[#0c182a]"
                        : item.required
                        ? "border-[#1d2b4f] bg-[#0d1429] hover:border-indigo-500/50"
                        : "border-[#17223e] bg-[#0a0f21] opacity-90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            uploaded
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : item.is_selfie
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                              : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                          }`}
                        >
                          {uploaded ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : item.is_selfie ? (
                            <Camera className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="text-[13px] font-bold text-white flex items-center gap-1.5 flex-wrap">
                            <span>{item.title}</span>
                            {item.required ? (
                              <span className="text-[9.5px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded">
                                Mandatory
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-medium bg-slate-500/20 text-slate-400 px-1.5 py-0.2 rounded">
                                Optional
                              </span>
                            )}
                            <span className="text-[9.5px] text-slate-400 bg-[#141d38] px-1.5 py-0.2 rounded border border-[#212f54]">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {uploaded ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Uploaded ✓
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Area: Either preview of uploaded file or upload buttons */}
                    <div className="mt-3.5 pt-3 border-t border-[#18233f]">
                      {uploaded ? (
                        <div className="flex items-center justify-between flex-wrap gap-2 bg-[#080d1c] p-2.5 rounded-xl border border-[#1b2747]">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-[11.5px] font-medium text-white truncate max-w-[200px] sm:max-w-[260px]">
                              {uploaded.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {uploaded.file_url && (
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(uploaded)}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 px-2 py-1 rounded bg-[#111933] border border-[#223157]"
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>
                            )}

                            {/* Hidden file input for replace */}
                            <input
                              type="file"
                              ref={(el) => (fileInputRefs.current[item.doc_type] = el)}
                              accept={item.accept}
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileSelected(item.doc_type, f);
                              }}
                            />
                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => fileInputRefs.current[item.doc_type]?.click()}
                              className="text-[11px] text-slate-300 hover:text-white font-medium flex items-center gap-1 px-2 py-1 rounded bg-[#131c36] hover:bg-[#1a264a] border border-[#223157]"
                            >
                              {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Replace"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Upload Trigger Buttons */
                        <div className="space-y-2">
                          {/* Hidden standard file picker */}
                          <input
                            type="file"
                            ref={(el) => (fileInputRefs.current[item.doc_type] = el)}
                            accept={item.accept}
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileSelected(item.doc_type, f);
                            }}
                          />

                          {/* Hidden camera capture input */}
                          <input
                            type="file"
                            ref={(el) => (cameraInputRefs.current[item.doc_type] = el)}
                            accept="image/*"
                            capture={item.is_selfie ? "user" : "environment"}
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileSelected(item.doc_type, f);
                            }}
                          />

                          <div className="grid grid-cols-2 gap-2">
                            {/* Mobile Snap Photo Button */}
                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => cameraInputRefs.current[item.doc_type]?.click()}
                              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-900/50 to-blue-900/40 hover:from-indigo-800/60 hover:to-blue-800/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
                            >
                              <Camera className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{item.is_selfie ? "Take Live Selfie" : "Take Photo"}</span>
                            </button>

                            {/* Choose File / PDF Button */}
                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => fileInputRefs.current[item.doc_type]?.click()}
                              className="py-2.5 px-3 rounded-xl bg-[#111933] hover:bg-[#182347] border border-[#23335e] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                              <span>Upload File / PDF</span>
                            </button>
                          </div>

                          {isUploading && (
                            <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 py-1 font-semibold animate-pulse">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Encrypting & Uploading file…</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Action Bottom Bar */}
            <div className="sticky bottom-3 z-30 pt-3">
              <div className="rounded-2xl border border-indigo-500/40 bg-[#0d142b]/95 backdrop-blur-md p-3.5 shadow-2xl space-y-2">
                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={handleCompleteSubmission}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    canSubmit
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-emerald-500/20 active:scale-[0.99] cursor-pointer"
                      : "bg-[#151f38] text-slate-400 border border-[#22325c] cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting to Loan Officer…</span>
                    </>
                  ) : canSubmit ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span className="tracking-wide uppercase">Submit All Documents to Loan Officer →</span>
                    </>
                  ) : (
                    <span>
                      Upload Remaining {requiredList.length - uploadedRequired.length} Mandatory Document(s) to Submit
                    </span>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Your documents are stored securely with bank-grade AES-256 encryption.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e162d] border border-[#22325c] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3.5 border-b border-[#1c294d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white truncate max-w-[280px]">
                  {previewDoc.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-7 h-7 rounded-lg bg-[#141f3d] text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-[#070b16]">
              {previewDoc.file_url?.startsWith("data:image/") ? (
                <img
                  src={previewDoc.file_url}
                  alt={previewDoc.name}
                  className="max-h-[65vh] w-auto rounded-lg object-contain border border-[#1b274a]"
                />
              ) : previewDoc.file_url?.startsWith("data:application/pdf") ? (
                <iframe
                  src={previewDoc.file_url}
                  title={previewDoc.name}
                  className="w-full h-[65vh] rounded-lg border border-[#1b274a]"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-12 h-12 text-indigo-400 mx-auto" />
                  <p className="text-xs text-white font-medium">{previewDoc.name}</p>
                  <a
                    href={previewDoc.file_url}
                    download={previewDoc.name}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md"
                  >
                    Download File ↗
                  </a>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[#1c294d] bg-[#0b1226] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-[#172344] hover:bg-[#20305c] text-white text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#121c33] bg-[#080d1c] py-4 text-center text-[10.5px] text-slate-400">
        <div className="max-w-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Growth Nations · India's Intelligent Lending OS</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Lock className="w-2.5 h-2.5" /> End-to-End Encrypted
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
