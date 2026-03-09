import { IDeck } from '@domain/deck/deck.interface';

import { toTaskSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getDeckToTaskPrompt(deck: IDeck): ConversionPrompt {
  const flashcardsSummary = deck.flashcards
    .map((fc, i) => `${i + 1}. Frente: ${fc.front}\n Verso: ${fc.back}`)
    .join('\n\n');

  return {
    systemPrompt: `Você é um assistente educacional especializado em transformar decks de flashcards em tarefas de revisão.
      Analise os flashcards fornecidos e gere uma tarefa objetiva de estudo resumindo os tópicos que precisam ser revisados.
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Crie uma tarefa de revisão a partir do seguinte deck de flashcards:
      Nome do Deck: ${deck.name}
      ${deck.description ? `Descrição: ${deck.description}\n` : ''}
      Tópicos do deck: ${flashcardsSummary}
      Gere um nome curto e objetivo para a tarefa e uma descrição resumindo o que deve ser estudado com base nos flashcards.`,
    schema: toTaskSchema
  };
}
