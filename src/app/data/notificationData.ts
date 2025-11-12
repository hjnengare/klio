import { TRENDING_BUSINESSES } from "./businessData";
import { ToastNotificationData } from "../components/ToastNotification/ToastNotification";

const NOTIFICATION_MESSAGES = {
  review: [
    "Someone just reviewed",
    "New review for",
    "Just reviewed",
    "Someone in your area reviewed",
    "Fresh review on",
  ],
  business: [
    "New business added",
    "Just joined sayso",
    "New in your area",
    "Fresh on sayso",
  ],
  user: [
    "Someone just saved",
    "Just bookmarked",
    "Someone added to favorites",
  ],
  highlyRated: [
    "Highly rated business",
    "Top-rated near you",
    "⭐ Exceptional ratings for",
    "Community favorite",
    "Outstanding reviews for",
  ],
};

const TIME_RANGES = [
  "2 Minutes",
  "5 Minutes",
  "10 Minutes",
  "15 Minutes",
  "30 Minutes",
  "1 Hour",
];

export function generateRandomNotification(): ToastNotificationData {
  const types: ("review" | "business" | "user" | "highlyRated")[] = ["review", "business", "user", "highlyRated"];
  const type = types[Math.floor(Math.random() * types.length)];

  const business = TRENDING_BUSINESSES[
    Math.floor(Math.random() * TRENDING_BUSINESSES.length)
  ];

  const messages = NOTIFICATION_MESSAGES[type];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const timeAgo = TIME_RANGES[Math.floor(Math.random() * TIME_RANGES.length)];

  return {
    id: `${Date.now()}-${Math.random()}`,
    type,
    message,
    title: business.name,
    timeAgo,
    image: business.image,
    imageAlt: business.alt,
    link: business.href,
  };
}

export function generateNotificationBatch(count: number = 1): ToastNotificationData[] {
  return Array.from({ length: count }, () => generateRandomNotification());
}
