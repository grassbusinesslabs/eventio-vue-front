export interface CurrentUser {
   token: string;
   user: {
      id: number;
      email: string;
      firstName: string;
      secondName: string;
   };
}
