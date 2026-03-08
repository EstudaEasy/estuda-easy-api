import { IQuizOption } from './quiz-option.interface';

export class QuizOptionEntity implements IQuizOption {
  constructor(props: IQuizOption) {
    Object.assign(this, props);
  }

  id: number;
  quizItemId: number;
  text: string;
  isCorrect: boolean;
  position: number;
}
