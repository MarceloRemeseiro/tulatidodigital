export interface ServiceContent {
  title: string;
  subtitle: string;
  toggle: {
    packages: string;
    individual: string;
  };
  packages: Package[];
  individualServices: IndividualService[];
  modal: Modal;
}

export interface Package {
  id?: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
}

export interface IndividualService {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'ia-special';
  cta: string;
}

export interface Modal {
  title: string;
  subtitle: string;
  paragraph: string;
  stepsTitle: string;
  steps: Step[];
  benefitsTitle: string;
  benefits: string[];
  cta: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role: string;
} 