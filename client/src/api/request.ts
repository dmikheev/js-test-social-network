import { IApiError } from './dataTypes';

interface IRequestOptions extends RequestInit {
  body?: any;
}

export default function request(url: string, options?: IRequestOptions): Promise<any> {
  return fetch(url, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
    body: (options && options.body) ? JSON.stringify(options.body) : undefined,
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorJson: IApiError) => {
          throw errorJson;
        });
      }

      return response.status === 200 ? response.json() : undefined;
    });
}
