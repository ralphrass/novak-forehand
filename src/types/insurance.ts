// Novas interfaces para dados com validação
export interface ExtractedField<T> {
  value: T;
  confidence: number;
  pdfContext: string;
}

export interface ExtractedInsuranceData {
  vehicleData: {
    insuredName: ExtractedField<string>;
    vehicle: {
      makeModelYear: ExtractedField<string>;
      plate: ExtractedField<string>;
      fipeCode: ExtractedField<string>;
    };
  };
  coverage: {
    comprehensive: ExtractedField<string>;
    deductible: ExtractedField<string>;
    thirdPartyLiability: {
      propertyDamage: ExtractedField<string>;
      bodilyInjury: ExtractedField<string>;
    };
    moralDamages: ExtractedField<string>;
    greenCard: ExtractedField<string>;
    roadside: ExtractedField<string>;
    rentalCar: ExtractedField<string>;
    glass: ExtractedField<string>;
  };
  payment: {
    annualPremium: ExtractedField<string>;
    paymentOptions: ExtractedField<{
      debit: string;
      creditCard: string;
    }>;
  };
  mainDriver: {
    name: ExtractedField<string>;
    birthDate: ExtractedField<string>;
    maritalStatus: ExtractedField<string>;
    youngDriverCoverage: ExtractedField<string>;
    garage: ExtractedField<string>;
    zipCode: ExtractedField<string>;
    vehicleUse: ExtractedField<string>;
  };
}

interface VehicleData {
  insuredName: string;
  vehicle: {
    makeModelYear: string;
    plate: string;
    fipeCode: string;
  };
}

interface Coverage {
  comprehensive: {
    type: string;
    value: string;
  };
  deductible: {
    value: string;
  };
  thirdPartyLiability: {
    propertyDamage: string;
    bodilyInjury: string;
  };
  moralDamages: string;
  greenCard: string;
  roadside: string;
  rentalCar: string;
  glass: {
    coverage: string;
    deductibles: {
      conventionalHeadlights: string;
      ledHeadlights: string;
      xenonHeadlights: string;
      conventionalAuxLights: string;
      ledAuxLights: string;
      xenonAuxLights: string;
      conventionalTaillights: string;
      auxTaillights: string;
      ledTaillights: string;
      windshield: string;
      conventionalMirrors: string;
      sunroof: string;
      sidePanels: string;
      rearWindow: string;
    };
  };
}

interface Payment {
  annualPremium: string;
  paymentOptions: {
    debit: string;
    creditCard: string;
    porto: string;
  };
}

interface MainDriver {
  name: string;
  birthDate: string;
  maritalStatus: string;
  youngDriverCoverage: string;
  garage: string;
  zipCode: string;
  vehicleUse: string;
}

export interface InsuranceProposal {
  vehicleData: VehicleData;
  coverage: Coverage;
  payment: Payment;
  mainDriver: MainDriver;
}