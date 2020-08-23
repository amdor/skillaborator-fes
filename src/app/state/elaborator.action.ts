import { createAction } from '@ngrx/store';
import { Question } from '../component/elaborator-question.model';

const ACTION_PREFIX = 'Elaborator';

export namespace ElaboratorAction {
    export const getQuestion = createAction(`${ACTION_PREFIX} Get Question`, (level: number) => ({level}));
    export const getQuestionSuccess = createAction(`${ACTION_PREFIX} Get Question`, (question: Question) => ({question}));
}
