import { google } from '@ai-sdk/google';
import { generateText, streamText, type ModelMessage } from 'ai';

export const generateGeminiText = async ({
  model = 'gemini-3.6-flash',
  system,
  messages,
  maxOutputTokens,
}: {
  model?: string;
  system?: string;
  messages: ModelMessage[];
  maxOutputTokens?: number;
}) => {
  const result = await generateText({
    model: google(model),
    system,
    messages,
    maxOutputTokens,
  });

  return result.text;
};

export const streamGeminiText = ({
  model = 'gemini-3.6-flash',
  system,
  messages,
}: {
  model?: string;
  system?: string;
  messages: ModelMessage[];
}) =>
  streamText({
    model: google(model),
    system,
    messages,
  });
