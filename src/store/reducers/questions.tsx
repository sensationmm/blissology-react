/* eslint-disable @typescript-eslint/no-explicit-any */

type IQuestionResponseOption = {
  option: string;
};

export interface IQuestionConfig {
  id: number;
  question: string;
  responseType: 'text' | 'boolean' | 'select';
  responseOptions: IQuestionResponseOption[];
}

export type IQuestions = {
  [key: string]: IQuestionConfig[];
};

export type IQuestionAnswers = Record<string, string>;

export const initialState: IQuestions = {};

const questionAnswersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'questions/set':
      return {
        ...state,
        ...action.payload.questions
      };
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default questionAnswersReducer;
