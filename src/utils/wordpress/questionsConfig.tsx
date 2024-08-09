import { IQuestionAnswers, IQuestionConfig, IQuestions } from 'src/store/reducers/questions';

import { WPPost } from 'src/types/wp-rest-api';

export type WPQuestionConfig = WPPost[];

type WPQuestionAnswer = {
  question: number;
  answer: string;
};

export const formatQuestionConfigResponse = (questionConfigs: WPQuestionConfig): IQuestions => {
  const questions: IQuestions = {};

  questionConfigs.forEach((config) => {
    const categories: string[] = config._embedded ? config._embedded['wp:term']?.map((catList) => catList.map((cat) => cat.name)).flat() : [];

    const newQuestionConfig: IQuestionConfig = {
      id: config.id,
      question: config.title.rendered,
      responseOptions: config.acf.response_options,
      responseType: config.acf.response_type
    };

    categories.forEach((cat) => {
      const key = cat.split(' ').join('');
      if (Object.keys(questions).includes(key)) {
        questions[key] = questions[key].concat([newQuestionConfig]);
      } else {
        questions[key] = [newQuestionConfig];
      }
    });
  });

  return questions;
};

export const formatQuestionAnswersResponse = (questionAnswers: WPQuestionAnswer[]): IQuestionAnswers => {
  const responsesObject: IQuestionAnswers = {};
  questionAnswers.forEach((q) => {
    responsesObject[q.question] = q.answer;
  });
  return responsesObject;
};

export const questionAnswersPayload = (questionAnswers: IQuestionAnswers): WPQuestionAnswer[] => {
  return Object.keys(questionAnswers).map((qaID) => ({
    answer: questionAnswers[qaID],
    question: parseInt(qaID)
  }));
};
