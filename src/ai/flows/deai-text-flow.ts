
'use server';
/**
 * @fileOverview An AI agent for making text sound less AI-generated.
 *
 * - deAiText - A function that processes text to make it sound more human-like.
 * - DeAiTextInput - The input type for the deAiText function.
 * - DeAiTextOutput - The return type for the deAiText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeAiTextInputSchema = z.object({
  text: z.string().describe('The text to be de-AI-ified.'),
});
export type DeAiTextInput = z.infer<typeof DeAiTextInputSchema>;

const DeAiTextOutputSchema = z.object({
  deAIText: z.string().describe('The text after being processed to sound more human-like.'),
});
export type DeAiTextOutput = z.infer<typeof DeAiTextOutputSchema>;

export async function deAiText(input: DeAiTextInput): Promise<DeAiTextOutput> {
  return deAiTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deAiTextPrompt',
  input: {schema: DeAiTextInputSchema},
  output: {schema: DeAiTextOutputSchema},
  prompt: `You are an expert in making AI-generated text sound more human-like. Your task is to rewrite the given text to remove any tell-tale signs of AI generation. Make it sound natural, engaging, and less formal or robotic. Focus on varying sentence structure, using more common vocabulary, and injecting a more personal tone where appropriate, without altering the core meaning.

Text: {{{text}}}

Humanized Text:
{{deAIText}}`,
});

const deAiTextFlow = ai.defineFlow(
  {
    name: 'deAiTextFlow',
    inputSchema: DeAiTextInputSchema,
    outputSchema: DeAiTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
