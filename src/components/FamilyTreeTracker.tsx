import React from "react";
import { Patient } from "../types";
import { FamilyTreeService } from "./FamilyTreeService";
export { FamilyTreeService } from "./FamilyTreeService";
export * from "./family/types";

interface FamilyTreeTrackerProps {
  patient?: Patient;
  onBack?: () => void;
}

export const FamilyTreeTracker: React.FC<FamilyTreeTrackerProps> = ({ patient, onBack }) => {
  return <FamilyTreeService patient={patient} onBack={onBack} />;
};
