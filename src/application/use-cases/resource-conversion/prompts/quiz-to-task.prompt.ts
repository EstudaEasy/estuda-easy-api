import { IQuiz } from '@domain/quiz/quiz.interface';

import { toTaskSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getQuizToTaskPrompt(quiz: IQuiz): ConversionPrompt {
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
    systemPrompt: `Você é um assistente educacional especializado em transformar quizzes em tarefas de revisão.
      Analise o conteúdo do quiz fornecido e gere uma tarefa objetiva de estudo que resuma o que precisa ser revisado.
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Crie uma tarefa de revisão a partir do seguinte quiz:
      Título do Quiz: ${quiz.title}
      ${quiz.description ? `Descrição: ${quiz.description}\n` : ''}
      Tópicos abordados: ${itemsSummary}
      Gere um nome curto e objetivo para a tarefa e uma descrição resumindo o que deve ser estudado ou revisado com base no quiz.`,
    schema: toTaskSchema
  };
}
