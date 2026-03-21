import { IQuiz } from '@domain/quiz/quiz.interface';

import { toDeckSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getQuizToDeckPrompt(quiz: IQuiz): ConversionPrompt {
  const itemsSummary = quiz.items
    .map((item, i) => {
      const correctOption = item.options.find((option) => option.isCorrect);
      return `${i + 1}. 
        Pergunta: ${item.question}\n 
        Resposta correta: ${correctOption?.text ?? 'N/A'}
        ${item.explanation ? `\n Explicação: ${item.explanation}` : ''}`;
    })
    .join('\n\n');

  return {
    systemPrompt: `Você é um assistente educacional especializado em transformar quizzes em flashcards de estudo.
      Analise as perguntas e respostas do quiz fornecido e gere um deck de flashcards representando cada conceito.
      Cada flashcard deve ter a pergunta na frente (front) e a resposta com explicação no verso (back).
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Converta o seguinte quiz em um deck de flashcards:
      Título do Quiz: ${quiz.title}
      ${quiz.description ? `Descrição: ${quiz.description}\n` : ''}
      Questões: ${itemsSummary}
      Gere um flashcard para cada questão. O nome e a descrição do deck devem refletir o tema do quiz.`,
    schema: toDeckSchema
  };
}
