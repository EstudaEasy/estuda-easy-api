import { IDeck } from '@domain/deck/deck.interface';

import { toQuizSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getDeckToQuizPrompt(deck: IDeck): ConversionPrompt {
  const flashcardsSummary = deck.flashcards
    .map((fc, i) => `${i + 1}. Frente: ${fc.front}\n Verso: ${fc.back}`)
    .join('\n\n');

  return {
    systemPrompt: `Você é um assistente educacional especializado em criar quizzes a partir de decks de flashcards.
      Analise os flashcards fornecidos e gere um quiz de múltipla escolha com perguntas baseadas nos conceitos dos flashcards.
      Cada questão deve ter exatamente 4 opções de resposta, sendo apenas 1 correta. As alternativas incorretas devem ser plausíveis.
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Converta o seguinte deck de flashcards em um quiz de múltipla escolha:
      Nome do Deck: ${deck.name}
      ${deck.description ? `Descrição: ${deck.description}\n` : ''}
      Flashcards: ${flashcardsSummary}
      Gere uma questão para cada flashcard. O título e a descrição do quiz devem refletir o tema do deck.`,
    schema: toQuizSchema
  };
}
