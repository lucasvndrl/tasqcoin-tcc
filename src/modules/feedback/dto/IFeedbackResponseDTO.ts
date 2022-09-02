import { IUserResponseDTO } from '@modules/users/dtos/IUserResponseDTO';

class IFeedbackResponseDTO {
  id: string;
  description: string;
  amount: number;
  user_from?: IUserResponseDTO;
  user_from_id: string;
  user_to?: IUserResponseDTO;
  user_to_id: string;
  type?: 'recieved' | 'sent';
  created_at: Date;
}

export { IFeedbackResponseDTO };
