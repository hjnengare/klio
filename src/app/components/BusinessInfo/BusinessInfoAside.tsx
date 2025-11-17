"use client";

import type { CSSProperties, ReactNode } from "react";
import { CheckCircle, DollarSign, Globe, Mail, MapPin, Phone } from "react-feather";
import type { BusinessInfo } from "./BusinessInfoModal";

interface BusinessInfoAsideProps {
  businessInfo: BusinessInfo;
  className?: string;
}

const sectionTitleStyle: CSSProperties = {
  fontFamily: '"DM Sans", system-ui, sans-serif',
};

export default function BusinessInfoAside({ businessInfo, className = "" }: BusinessInfoAsideProps) {
  const infoRows: Array<{
    icon: ReactNode;
    label: string;
    value?: string | null;
    render?: () => React.ReactNode;
  }> = [
    {
      icon: (
        <CheckCircle
          className={`w-4 h-4 flex-shrink-0 ${
            businessInfo.verified ? "text-sage" : "text-charcoal/40"
          }`}
        />
      ),
      label: "Verification",
      render: () => (
        <span className={`text-sm font-medium ${businessInfo.verified ? "text-sage" : "text-charcoal/60"}`}>
          {businessInfo.verified ? "Verified Business" : "Not Verified"}
        </span>
      ),
    },
    {
      icon: <MapPin className="w-4 h-4 flex-shrink-0 text-navbar-bg/90" />,
      label: "Location",
      value: businessInfo.location,
    },
    {
      icon: <MapPin className="w-4 h-4 flex-shrink-0 text-navbar-bg/90" />,
      label: "Address",
      value: businessInfo.address,
    },
    {
      icon: <Phone className="w-4 h-4 flex-shrink-0 text-navbar-bg/90" />,
      label: "Phone",
      render: () =>
        businessInfo.phone ? (
          <a
            href={`tel:${businessInfo.phone}`}
            className="text-sm text-navbar-bg/90 hover:text-sage transition-colors"
          >
            {businessInfo.phone}
          </a>
        ) : (
          <span className="text-sm italic text-charcoal/40">Phone number not provided</span>
        ),
    },
    {
      icon: <Mail className="w-4 h-4 flex-shrink-0 text-navbar-bg/90" />,
      label: "Email",
      render: () =>
        businessInfo.email ? (
          <a
            href={`mailto:${businessInfo.email}`}
            className="text-sm text-navbar-bg/90 hover:text-sage transition-colors break-all"
          >
            {businessInfo.email}
          </a>
        ) : (
          <span className="text-sm italic text-charcoal/40">Email not provided</span>
        ),
    },
    {
      icon: <Globe className="w-4 h-4 flex-shrink-0 text-navbar-bg/90" />,
      label: "Website",
      render: () =>
        businessInfo.website ? (
          <a
            href={
              businessInfo.website.startsWith("http")
                ? businessInfo.website
                : `https://${businessInfo.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-navbar-bg/90 hover:text-sage transition-colors break-all"
          >
            {businessInfo.website}
          </a>
        ) : (
          <span className="text-sm italic text-charcoal/40">Website not provided</span>
        ),
    },
    {
      icon: <DollarSign className="w-4 h-4 flex-shrink-0 text-navbar-bg/90" />,
      label: "Price Range",
      value: businessInfo.price_range,
    },
  ];

  const asideClasses =
    "bg-card-bg/90 backdrop-blur-xl border border-white/60 rounded-[20px] p-5 sm:p-6 space-y-5";

  return (
    <aside
      className={`${asideClasses} ${className}`}
      aria-labelledby="business-info-heading"
      style={{
        fontFamily: 'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-charcoal/50 font-semibold">Business Info</p>
        <h2 id="business-info-heading" className="text-lg font-bold text-charcoal" style={sectionTitleStyle}>
          {businessInfo.name || "Business Information"}
        </h2>
        <p className={`text-sm text-charcoal/70 leading-relaxed ${businessInfo.description ? "" : "italic text-charcoal/40"}`}>
          {businessInfo.description || "No description available."}
        </p>
        {businessInfo.category && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/40 bg-white/20 text-xs font-semibold text-charcoal/80">
            <span>{businessInfo.category}</span>
          </div>
        )}
      </header>

      <ul className="space-y-4">
        {infoRows.map((row) => (
          <li key={row.label} className="flex gap-3">
            <span className="w-10 h-10 rounded-full bg-white/30 border border-white/40 text-navbar-bg/90 grid place-items-center flex-shrink-0">
              {row.icon}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-charcoal mb-0.5" style={sectionTitleStyle}>
                {row.label}
              </p>
              {row.render ? (
                row.render()
              ) : (
                <p
                  className={`text-sm ${
                    row.value ? "text-charcoal/70" : "italic text-charcoal/40"
                  }`}
                >
                  {row.value || "Not provided"}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

