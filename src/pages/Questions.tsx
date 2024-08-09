import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import { Accordion, AccordionDetails, AccordionSummary, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

import store, { RootState } from 'src/store';
import { IQuestionAnswers, IQuestions } from 'src/store/reducers/questions';

import { wpRestApiHandler } from 'src/api/wordpress';

import Layout from 'src/components/Layout/Layout';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { formatQuestionAnswersResponse, formatQuestionConfigResponse, questionAnswersPayload } from 'src/utils/wordpress/questionsConfig';

const Questions = () => {
  const authState = (state: RootState) => state.auth;
  const { token } = useSelector(authState);
  const weddingState = (state: RootState) => state.wedding;
  const { weddingID } = useSelector(weddingState);
  const questionsAnswersState = (state: RootState) => state.questionAnswers;
  const QuestionsAnswers = useSelector(questionsAnswersState);
  const [questions, setQuestions] = useState<IQuestions>({});
  const [responses, setResponses] = useState<IQuestionAnswers>(QuestionsAnswers);

  const [resetAnswers, setResetAnswers] = useState<IQuestionAnswers>();
  const [openSnackbar] = useSnackbar();

  const isEdited = JSON.stringify(responses) !== JSON.stringify(resetAnswers);

  useEffect(() => {
    if (Object.keys(questions).length === 0 && !!token) {
      store.dispatch({
        payload: { isLoading: true },
        type: 'ui/setLoading'
      });
      wpRestApiHandler(`question`, undefined, 'GET', token).then(async (resp) => {
        const respJson = await resp.json();

        setQuestions(formatQuestionConfigResponse(respJson));

        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });
      });
    }
  }, []);

  useEffect(() => {
    !resetAnswers && setResetAnswers(cloneDeep(QuestionsAnswers));
  }, [QuestionsAnswers]);

  const onSaveAnswers = () => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });
    wpRestApiHandler(
      `wedding/${weddingID}`,
      {
        acf: {
          questions_answers: questionAnswersPayload(responses)
        }
      },
      'POST',
      token
    )
      .then(async (resp) => {
        if (resp.ok) {
          const response = await resp.json();
          store.dispatch({
            payload: { questions: formatQuestionAnswersResponse(response?.acf?.questions_answers) },
            type: 'questions/set'
          });

          setResetAnswers(cloneDeep(responses));
          return resp;
        }

        return false;
      })
      .finally(() => {
        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });
        openSnackbar('Answers saved');
      });
  };

  const onResetAnswers = () => {
    setResponses(QuestionsAnswers);
  };

  const onAnswer = (index: number, answer: string) => {
    const answers = cloneDeep(responses);
    answers[index] = answer;
    setResponses(answers);
  };

  useUnsaved({
    isUnsaved: isEdited,
    onConfirm: onResetAnswers
  });

  return (
    <Layout
      title="Questions"
      actions={[
        { color: 'secondary', disabled: !isEdited, label: 'Reset', onClick: onResetAnswers },
        { disabled: !isEdited, label: 'Save Answers', onClick: onSaveAnswers }
      ]}>
      <Grid container spacing={2}>
        {Object.keys(questions).length > 0 &&
          Object.keys(questions).map((category: string, index: number) => {
            const quIds = questions[category].map((qu) => qu.id);
            const unanswered = quIds.reduce((acc, curr) => (!responses[curr] || responses[curr] === '' ? acc + 1 : acc), 0);

            return (
              <Grid item xs={12} key={`question-category-${index}`}>
                <Accordion>
                  <AccordionSummary id={`category-header-${index}`}>
                    <Typography sx={{ width: '58%' }} variant="h2">
                      {category}
                    </Typography>
                    <Typography sx={{ alignItems: 'center', color: 'text.secondary', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                      {questions[category].length} question{questions[category].length !== 1 ? 's' : ''}
                      {unanswered > 0 && ` (${unanswered} unanswered)`}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {questions[category].map((question, index2) => {
                        const props = {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onChange: (e: any) => onAnswer(question.id, e.target.value),
                          value: responses[question.id] || ''
                        };

                        return (
                          <Grid item key={`${category}-question-${index2}`} xs={12}>
                            <Grid container>
                              <Grid item xs={7} sx={{ alignItems: 'center', display: 'flex', paddingRight: '20px' }}>
                                <Typography>{question.question}</Typography>
                              </Grid>
                              <Grid item xs={5}>
                                {question.responseType === 'text' ? (
                                  <TextField placeholder="Enter your response" size="small" sx={{ width: '100%' }} {...props} />
                                ) : question.responseType === 'select' ? (
                                  <Select size="small" sx={{ width: '100%' }} {...props}>
                                    {question.responseOptions.map((opt, index3) => (
                                      <MenuItem key={`${category}-question-${index2}-option-${index3}`} value={opt.option}>
                                        {opt.option}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                ) : (
                                  ''
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
      </Grid>
    </Layout>
  );
};

export default Questions;
