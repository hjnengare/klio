"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { PageLoader } from "../../components/Loader";
import { BusinessOwnershipService } from "../../../lib/services/businessOwnershipService";
import { BusinessService } from "../../../lib/services/businessService";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Store,
  Mail,
  Phone,
  FileText,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import type { BusinessOwnershipRequest } from "../../../lib/services/businessOwnershipService";
import type { Business } from "../../../lib/types/database";

export default function VerificationStatusPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<BusinessOwnershipRequest[]>([]);
  const [businesses, setBusinesses] = useState<Record<string, Business>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/business/verification-status');
      return;
    }

    if (user) {
      loadRequests();
    }
  }, [user, authLoading, router]);

  const loadRequests = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userRequests = await BusinessOwnershipService.getUserOwnershipRequests(user.id);
      setRequests(userRequests);

      // Load business details for each request
      const businessMap: Record<string, Business> = {};
      for (const request of userRequests) {
        try {
          const business = await BusinessService.getBusinessById(request.business_id);
          if (business) {
            businessMap[request.business_id] = business;
          }
        } catch (error) {
          console.error(`Error loading business ${request.business_id}:`, error);
        }
      }
      setBusinesses(businessMap);
    } catch (error) {
      console.error('Error loading verification requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200 text-gray-700';
      default:
        return 'bg-amber-50 border-amber-200 text-amber-700';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'manual':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Store className="w-4 h-4" />;
    }
  };

  if (authLoading || isLoading) {
    return <PageLoader size="lg" color="sage" />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-dvh bg-off-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="group flex items-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-3 sm:mr-4">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-sage transition-colors duration-300" />
              </div>
              <h1 className="font-urbanist text-sm font-700 text-white transition-all duration-300 group-hover:text-white/80 relative">
                Verification Status
              </h1>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white pt-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/30">
              <Store className="w-7 h-7 text-charcoal" />
            </div>
            <h2 className="font-urbanist text-xl font-600 text-charcoal mb-2">
              Business Ownership Requests
            </h2>
            <p className="font-urbanist text-charcoal/70 text-sm max-w-md mx-auto">
              Track the status of your business ownership verification requests
            </p>
          </div>

          {/* Requests List */}
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Store className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="font-urbanist text-base font-600 text-charcoal mb-2">
                No verification requests
              </h3>
              <p className="font-urbanist text-charcoal/70 text-sm mb-6">
                You haven't submitted any business ownership verification requests yet.
              </p>
              <Link
                href="/claim-business"
                className="inline-block px-6 py-2.5 bg-coral text-white rounded-full text-sm font-600 font-urbanist
                           hover:bg-coral/90 transition-all duration-300 hover:shadow-lg"
              >
                Claim a Business
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const business = businesses[request.business_id];
                return (
                  <div
                    key={request.id}
                    className={`p-6 bg-gradient-to-br from-card-bg via-card-bg to-card-bg/95 backdrop-blur-md border rounded-xl ring-1 ring-white/20 ${getStatusColor(request.status)}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(request.status)}
                          <h3 className="font-urbanist text-base font-600 text-charcoal">
                            {business?.name || 'Business'}
                          </h3>
                        </div>
                        {business && (
                          <p className="font-urbanist text-sm text-charcoal/70">
                            {business.category} • {business.location}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-charcoal/70">
                        {getMethodIcon(request.verification_method)}
                        <span className="capitalize">{request.verification_method} verification</span>
                      </div>
                      <div className="text-xs text-charcoal/60">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </div>
                      {request.reviewed_at && (
                        <div className="text-xs text-charcoal/60">
                          Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}
                        </div>
                      )}
                      {request.rejection_reason && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Reason:</strong> {request.rejection_reason}
                          </p>
                        </div>
                      )}
                      {request.status === 'approved' && business && (
                        <Link
                          href={`/manage-business?business=${business.id}`}
                          className="inline-block mt-3 px-4 py-2 bg-coral text-white rounded-full text-sm font-600 font-urbanist
                                     hover:bg-coral/90 transition-all duration-300 hover:shadow-lg"
                        >
                          Manage Business
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

