export interface Step {
  id?: number;
  number: number;
  description: string;
  step?: number;
}

export interface StepItemResponse {
  id: number;
  step: number;
  text: string;
}

export interface StepPayload {
  step: number;
  text: string;
}
