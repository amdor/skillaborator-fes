import { createAction } from '@ngrx/store';
import { ReviewState } from '..';

const ACTION_PREFIX = 'Review';

export namespace ReviewAction {
  export const getEvaluationResults = createAction(
    `${ACTION_PREFIX} Get Evaluation Results`,
    (oneTimeCode: string) => ({
      oneTimeCode,
    })
  );

  export const getEvaluationResultsSuccess = createAction(
    `${ACTION_PREFIX} Get Evaluation Results Success`,
    (reviewState: ReviewState) => reviewState
  );

  export const getEvaluationResultsFail = createAction(
    `${ACTION_PREFIX} Get Evaluation Results Fail`
  );
}
