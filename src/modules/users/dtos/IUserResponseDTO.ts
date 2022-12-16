class IUserResponseDTO {
  id: string;
  name: string;
  balance: number;
  dark_balance: number;
  avatar: string;
  avatar_url: () => string;
}

export { IUserResponseDTO };
