import { IDiary } from '@domain/diary/diary.interface';

import { toDeckSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getDiaryToDeckPrompt(diary: IDiary): ConversionPrompt {
  return {
    systemPrompt: `Você é um assistente educacional especializado em criar flashcards a partir de anotações de estudo.
      Analise o conteúdo do diário de estudos fornecido e gere um deck de flashcards com os conceitos mais importantes.
      Cada flashcard deve ter um conceito/pergunta na frente (front) e a explicação/resposta no verso (back).
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Crie um deck de flashcards baseado no seguinte diário de estudos:
      Título: ${diary.title}
      Conteúdo: ${diary.content}
      Gere entre 5 e 15 flashcards cobrindo os principais conceitos do conteúdo. O nome e a descrição do deck devem refletir o tema do diário.`,
    schema: toDeckSchema
  };
}
