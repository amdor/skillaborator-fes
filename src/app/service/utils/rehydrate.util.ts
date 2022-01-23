import {
  Action,
  ActionReducer,
  createReducer,
  ActionCreator,
  ActionType,
} from '@ngrx/store';
import { StorageService, StorageType } from './storage.service';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';

export interface RehydrateOptions {
  key: string;
  storageType?: StorageType;
}

export function createRehydrateReducer<S, A extends Action = Action>(
  options: RehydrateOptions,
  initialState: S,
  ...ons: ReducerTypes<S, ActionCreator[]>[]
): ActionReducer<S, A> {
  const storageType = options.storageType ?? StorageType.Local;
  // rehydrate
  const newInitialState =
    StorageService.getForKey(options.key, storageType) ?? initialState;

  // new reducers save state to localstorage
  const newOns: ReducerTypes<S, ActionCreator[]>[] = [];
  ons.forEach((oldOn: ReducerTypes<S, ActionCreator[]>) => {
    const newReducer: ActionReducer<S, A> = (
      state: S | undefined,
      action: ActionType<ActionCreator[][number]>
    ) => {
      const newState = oldOn.reducer(state, action);
      StorageService.setForKey(options.key, newState, storageType);
      return newState;
    };
    newOns.push({ ...oldOn, reducer: newReducer });
  });
  return createReducer(newInitialState, ...newOns);
}
