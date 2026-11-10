import { useSyncExternalStore } from "react";

const NAVIGATE_EVENT = "admin:navigate";
function subscribe(callback) {
  window.addEventListener("popstate", callback);
  window.addEventListener(NAVIGATE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}

const getPath = () => window.location.pathname;
export function usePath() {
  return useSyncExternalStore(subscribe, getPath);
}
export function navigate(to) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, "", to);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  window.scrollTo(0, 0);
}
export function handleLinkClick(event, to) {
  const newTab = event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0;
  if (newTab) return;
  event.preventDefault();
  navigate(to);
}
