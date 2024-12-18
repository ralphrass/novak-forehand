export interface VehicleData {
    insuredName: string;
    vehicle: {
      makeModelYear: string;
      plate: string;
      fipeCode: string;
    };
  }
  
  export interface Coverage {
    comprehensive: {
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
  
  export interface Payment {
    annualPremium: string;
    paymentOptions: {
      debit: string;
      creditCard: string;
      porto?: string;
    };
  }
  
  export interface MainDriver {
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