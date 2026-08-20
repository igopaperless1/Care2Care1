import React from "react";
import { PasswordTracker } from "./PasswordTracker";

interface PasswordManagementTrackerProps {
  userId?: string;
  onNavigateHome?: () => void;
}

export const PasswordManagementTracker: React.FC<PasswordManagementTrackerProps> = () => {
  return <PasswordTracker />;
};

export default PasswordManagementTracker;
