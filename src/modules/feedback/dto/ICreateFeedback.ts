export interface ICreateFeedbackDTO {
  amount: number;
  description: string;
  user_from_id: string;
  user_to_id: string;
  is_dark: boolean;
}
