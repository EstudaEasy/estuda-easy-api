import { IDiary } from '@domain/diary/diary.interface';

import { toQuizSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getDiaryToQuizPrompt(diary: IDiary): ConversionPrompt {
  return {
    systemPrompt: `Você é um assistente educacional especializado em criar quizzes a partir de anotações de estudo.
      Analise o conteúdo do diário de estudos fornecido e gere um quiz de múltipla escolha com perguntas relevantes ao conteúdo.
      Cada questão deve ter exatamente 4 opções de resposta, sendo apenas 1 correta.
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Crie um quiz de múltipla escolha baseado no seguinte diário de estudos:
      Título: ${diary.title}
      Conteúdo: ${diary.content}
      Gere entre 5 e 10 questões relevantes. O título e a descrição do quiz devem refletir o tema do diário.`,
    schema: toQuizSchema
  };
}
