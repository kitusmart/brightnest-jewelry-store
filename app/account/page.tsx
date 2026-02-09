"use client";

import { useState, useEffect } from "react";
import {
  useUser,
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import {
  Edit2,
  Plus,
  LogOut,
  X,
  ChevronDown,
  MapPin,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  saveAddress,
  getAddresses,
  deleteAddress,
} from "@/app/actions/saveAddress";
import { toast } from "sonner";

export default function AccountPage() {
  return (
    <>
      <SignedIn>
        <AccountContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function AccountContent() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const fetchUserAddresses = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const data = await getAddresses(user.primaryEmailAddress.emailAddress);
      setAddresses(data);
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserAddresses();
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      addressLine: formData.get("addressLine"),
      apartment: formData.get("apartment"),
      city: formData.get("city"),
      state: formData.get("state"),
      postcode: formData.get("postcode"),
      phone: formData.get("phone"),
      isDefault: formData.get("isDefault") === "on",
    };

    const result = await saveAddress(
      data,
      user?.primaryEmailAddress?.emailAddress || "",
    );

    if (result.success) {
      toast.success("ADDRESS SAVED SUCCESSFULLY");
      setIsModalOpen(false);
      fetchUserAddresses();
    } else {
      toast.error("FAILED TO SAVE ADDRESS");
    }
    setIsSaving(false);
  };

  if (!isLoaded)
    return (
      <div className="p-20 text-center font-serif text-[#1B2A4E] tracking-widest uppercase text-xs">
        Loading Luxury Profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-white relative">
      {/* 🟢 FINAL NAVIGATION: Stacked for Mobile, Row for Desktop */}
      <div className="border-b border-gray-100 py-4 md:py-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          {/* LOGO & MAIN BUTTONS */}
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/full_logo.png"
                alt="Elysia Luxe"
                className="h-7 md:h-12 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-3 md:gap-6">
              <Link
                href="/"
                className="text-[9px] md:text-[10px] font-bold text-[#1B2A4E] uppercase tracking-[0.2em] px-3 py-2 md:px-4 md:py-2 border border-[#1B2A4E]/10 rounded-full hover:bg-[#1B2A4E] hover:text-white transition-all"
              >
                <span className="md:hidden">Shop</span>
                <span className="hidden md:inline">Go Shopping</span>
              </Link>

              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = "/";
                }}
                className="text-red-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-red-600 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* SECONDARY NAV: Orders & Profile (Visible on all views now) */}
          <nav className="flex items-center gap-8 pt-2 md:pt-0 md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link
              href="/orders"
              className="text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#1B2A4E] transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/account"
              className="text-[#1B2A4E] border-b border-[#1B2A4E] pb-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-20">
        <h1 className="text-xl md:text-2xl font-serif text-[#1B2A4E] mb-8 md:mb-10 uppercase tracking-widest">
          Profile
        </h1>

        <div className="space-y-6">
          <div className="bg-[#F9F9F9] rounded-xl p-6 md:p-8 border border-gray-50 group">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    Name
                  </label>
                  <Edit2
                    size={14}
                    className="text-[#D4AF37] md:opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  />
                </div>
                <p className="text-[#1B2A4E] font-medium text-base md:text-lg">
                  {user?.fullName}
                </p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                  Email
                </label>
                <p className="text-[#1B2A4E] font-medium text-sm md:text-base break-all">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F9F9F9] rounded-xl p-6 md:p-8 border border-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#1B2A4E] text-[11px] font-bold uppercase tracking-[0.2em]">
                Addresses
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.1em] hover:underline"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {isLoadingAddresses ? (
              <div className="text-center py-10 text-gray-400 text-[10px] uppercase tracking-widest">
                Fetching luxury address book...
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-gray-200 rounded-lg p-10 text-center">
                <p className="text-gray-400 text-xs italic tracking-widest">
                  No addresses added yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`bg-white p-6 rounded-xl border ${addr.isDefault ? "border-[#D4AF37]" : "border-gray-100"} shadow-sm relative group`}
                  >
                    <button
                      onClick={async () => {
                        if (
                          confirm(
                            "Are you sure you want to remove this address?",
                          )
                        ) {
                          const result = await deleteAddress(addr._id);
                          if (result.success) {
                            toast.success("ADDRESS REMOVED");
                            fetchUserAddresses();
                          } else {
                            toast.error("COULD NOT DELETE ADDRESS");
                          }
                        }
                      }}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    >
                      <Trash2 size={14} />
                    </button>

                    {addr.isDefault && (
                      <span className="absolute bottom-4 right-4 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                        Default
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-300 mt-1" />
                      <div className="space-y-1">
                        <p className="text-[#1B2A4E] font-bold text-sm uppercase tracking-tight">
                          {addr.firstName} {addr.lastName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {addr.addressLine}
                        </p>
                        {addr.apartment && (
                          <p className="text-gray-500 text-xs">
                            {addr.apartment}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs uppercase">
                          {addr.city}, {addr.state} {addr.postcode}
                        </p>
                        <p className="text-gray-400 text-[10px] pt-2">
                          AUS +61 {addr.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-medium text-gray-900 font-serif">
                Add address
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  name="isDefault"
                  className="rounded border-gray-300 text-black focus:ring-black"
                  id="default"
                />
                <label htmlFor="default" className="text-sm text-gray-600">
                  This is my default address
                </label>
              </div>

              <div className="relative group">
                <label className="absolute top-2 left-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  Country/region
                </label>
                <select className="w-full pt-6 pb-2 px-4 border border-gray-200 rounded-lg bg-white text-sm focus:border-black outline-none appearance-none">
                  <option>Australia</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 bottom-4 text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  required
                  placeholder="First name"
                  className="p-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
                />
                <input
                  name="lastName"
                  required
                  placeholder="Last name"
                  className="p-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>

              <input
                name="addressLine"
                required
                placeholder="Address"
                className="w-full p-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
              />
              <input
                name="apartment"
                placeholder="Apartment, suite, etc (optional)"
                className="w-full p-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name="city"
                  required
                  placeholder="City"
                  className="p-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
                />
                <div className="relative">
                  <select
                    name="state"
                    required
                    className="w-full p-4 border border-gray-200 rounded-lg bg-white text-sm focus:border-black outline-none appearance-none"
                  >
                    <option value="">State</option>
                    <option>New South Wales</option>
                    <option>Victoria</option>
                    <option>Queensland</option>
                    <option>Western Australia</option>
                    <option>South Australia</option>
                    <option>Tasmania</option>
                    <option>ACT</option>
                    <option>Northern Territory</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-5 text-gray-400"
                  />
                </div>
                <input
                  name="postcode"
                  required
                  placeholder="Postcode"
                  className="p-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-4 text-sm text-gray-500">
                  +61
                </span>
                <input
                  name="phone"
                  required
                  placeholder="Phone"
                  className="w-full p-4 pl-14 border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end items-center gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-sm font-medium text-[#0088cc] hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-black text-white px-10 py-3 rounded-lg text-sm font-bold hover:bg-black/90 disabled:bg-gray-400 transition-all shadow-md"
                >
                  {isSaving ? "SAVING..." : "SAVE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
