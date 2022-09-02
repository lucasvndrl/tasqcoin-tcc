class IUserResponseDTO {
  id: string;
  name: string;
  balance: number;
  avatar: string;
  avatar_url: () => string;
}

export { IUserResponseDTO };
