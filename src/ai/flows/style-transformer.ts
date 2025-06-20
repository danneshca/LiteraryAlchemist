// src/ai/flows/style-transformer.ts
'use server';
/**
 * @fileOverview A style transformation AI agent.
 *
 * - styleTransform - A function that handles the style transformation process.
 * - StyleTransformInput - The input type for the styleTransform function.
 * - StyleTransformOutput - The return type for the styleTransform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleTransformInputSchema = z.object({
  text: z.string().describe('The input text to transform.'),
  targetStyle: z.string().describe('The target style to transform the text to (e.g., Lu Xun, Hayao Miyazaki).'),
});
export type StyleTransformInput = z.infer<typeof StyleTransformInputSchema>;

const StyleTransformOutputSchema = z.object({
  transformedText: z.string().describe('The transformed text in the target style.'),
});
export type StyleTransformOutput = z.infer<typeof StyleTransformOutputSchema>;

export async function styleTransform(input: StyleTransformInput): Promise<StyleTransformOutput> {
  return styleTransformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleTransformPrompt',
  input: {schema: StyleTransformInputSchema},
  output: {schema: StyleTransformOutputSchema},
  prompt: `You are an expert in transforming text into the style of famous authors.

  Transform the following text into the style of {{targetStyle}}:

  {{{text}}}`,
});

const styleTransformFlow = ai.defineFlow(
  {
    name: 'styleTransformFlow',
    inputSchema: StyleTransformInputSchema,
    outputSchema: StyleTransformOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
