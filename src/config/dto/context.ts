
export interface UserContext {
  id: number;
  email: string;
}

export interface RequestContext {
  user: UserContext
}



