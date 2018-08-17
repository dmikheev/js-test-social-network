import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

interface ITypesOption {
  request?: string;
  success?: string;
  error?: string;
}
interface IReduxRequestOptions {
  requestActionData?: any;
  types: ITypesOption;
}

type TReduxRequestAction<R, S, A extends AnyAction> = ThunkAction<Promise<any>, S, void, A>;
export function reduxRequest<R, S, A extends AnyAction>(
  requestPromise: Promise<R>,
  options: IReduxRequestOptions,
): TReduxRequestAction<R, S, A> {
  return (dispatch) => {
    dispatch(onRequest(options.types.request, options.requestActionData));

    return requestPromise
      .then((data) => {
        dispatch(onSuccess(options.types.success, data, options.requestActionData));
        return data;
      })
      .catch((error) => {
        dispatch(onError(options.types.error, error, options.requestActionData));
        throw error;
      });
  };
}

function onRequest<S, A extends AnyAction>(type?: string, requestActionData?: any): ThunkAction<void, S, void, A> {
  return (dispatch) => {
    if (!type) {
      return;
    }

    dispatch(({ requestActionData, type } as AnyAction) as A);
  };
}
function onSuccess<S, A extends AnyAction>(
  type?: string,
  data?: any,
  requestActionData?: any,
): ThunkAction<void, S, void, A> {
  return (dispatch) => {
    if (!type) {
      return;
    }

    const action: A = ({ data, requestActionData, type } as AnyAction) as A;
    dispatch(action);
  };
}
function onError<S, A extends AnyAction>(
  type?: string,
  error?: any,
  requestActionData?: any,
): ThunkAction<void, S, void, A> {
  return (dispatch) => {
    if (!type) {
      return;
    }

    const action: A = ({ requestActionData, type, data: error } as AnyAction) as A;
    dispatch(action);
  };
}
