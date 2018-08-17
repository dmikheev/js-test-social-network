import { IUser } from './dataTypes';
import request from './request';

interface IUserAuthInput {
  lastname?: string;
  login: string;
  name?: string;
  pass: string;
}

export interface IUserAuthResponse {
  operation: string;
  user: IUser;
}

export default function auth(input: IUserAuthInput): Promise<IUserAuthResponse> {
  return request('/api/auth', {
    body: input,
    method: 'POST',
  });
}
