import { IDiary } from '@domain/diary/diary.interface';

import { toTaskSchema } from '../schemas';
import { ConversionPrompt } from '../types';

export function getDiaryToTaskPrompt(diary: IDiary): ConversionPrompt {
  return {
    systemPrompt: `Você é um assistente educacional especializado em transformar anotações de estudo em tarefas de revisão.
      Analise o conteúdo do diário de estudos fornecido e gere uma tarefa de estudo objetiva e acionável.
      Retorne o resultado estritamente no formato JSON especificado.`,
    userPrompt: `Crie uma tarefa de estudo a partir do seguinte diário de estudos:
      Título: ${diary.title}
      Conteúdo: ${diary.content}
      Gere um nome curto e objetivo para a tarefa e uma descrição clara do que deve ser feito ou revisado com base no conteúdo.`,
    schema: toTaskSchema
  };
}
