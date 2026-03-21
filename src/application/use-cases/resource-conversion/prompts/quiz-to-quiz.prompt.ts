import { IQuiz } from '@domain/quiz/quiz.interface';

import { toQuizSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getQuizToQuizPrompt(quiz: IQuiz): ConversionPrompt {
  const hasItems = quiz.items.length > 0;
  const MAX_QUESTION_COUNT = 4;

  const themeContext =
    [quiz.title, quiz.description].filter((value): value is string => Boolean(value?.trim())).join(' - ') ||
    'Tema não especificado';

  const itemsSummary = hasItems
    ? quiz.items
        .map((item, i) => {
          const correctOption = item.options.find((option) => option.isCorrect);
          return `${i + 1}. 
        Pergunta: ${item.question}\n 
        Resposta correta: ${correctOption?.text ?? 'N/A'}
        ${item.explanation ? `\n Explicação: ${item.explanation}` : ''}`;
        })
        .join('\n\n')
    : '';

  const sourceContext = hasItems
    ? `Questões atuais (somente referência de tema): ${itemsSummary}`
    : 'Questões atuais: não há questões no quiz original.';

  const generationGuidance = hasItems
    ? `Gere de 1 até ${MAX_QUESTION_COUNT} questões sobre o mesmo tema e nível de dificuldade.
      Evite repetir as questões atuais e mantenha o título e a descrição do novo quiz alinhados ao tema original.`
    : `Gere de 1 até ${MAX_QUESTION_COUNT} questões novas com base apenas no tema central (título e descrição).
      Defina um nível de dificuldade coerente com o tema e mantenha o título e a descrição do novo quiz alinhados ao contexto original.`;

  const contextPriority = hasItems
    ? 'Use as questões atuais apenas como apoio secundário para entender nível e contexto.'
    : 'Como não há questões atuais, use somente título e descrição para definir contexto, escopo e dificuldade.';

  return {
    systemPrompt: `Você é um assistente educacional especializado em criar quizzes sobre o tema "${quiz.title}".
      Analise o tema principal usando primeiro o título e a descrição do quiz.
      ${contextPriority}
      Gere um novo quiz de múltipla escolha alinhado ao tema central, com questões novas e variadas.
      Cada questão deve ter exatamente 4 opções de resposta, sendo apenas 1 correta. As alternativas incorretas devem ser plausíveis.
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Crie um novo quiz de múltipla escolha a partir do quiz abaixo:
      Título do Quiz: ${quiz.title}
      ${quiz.description ? `Descrição: ${quiz.description}\n` : ''}
      Tema central esperado: ${themeContext}
      ${sourceContext}
      ${generationGuidance}
      Se houver conflito, priorize sempre o tema indicado no título e na descrição.`,
    schema: toQuizSchema
  };
}
