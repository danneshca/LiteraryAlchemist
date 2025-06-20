'use server';

/**
 * @fileOverview Provides structural suggestions for improving text flow and coherence.
 *
 * - structureAdvisor - A function that suggests structural improvements for a given text.
 * - StructureAdvisorInput - The input type for the structureAdvisor function.
 * - StructureAdvisorOutput - The return type for the structureAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StructureAdvisorInputSchema = z.object({
  text: z.string().describe('The text to analyze and provide structural suggestions for.'),
});
export type StructureAdvisorInput = z.infer<typeof StructureAdvisorInputSchema>;

const StructureAdvisorOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of structural suggestions for the input text.'),
});
export type StructureAdvisorOutput = z.infer<typeof StructureAdvisorOutputSchema>;

export async function structureAdvisor(input: StructureAdvisorInput): Promise<StructureAdvisorOutput> {
  return structureAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'structureAdvisorPrompt',
  input: {schema: StructureAdvisorInputSchema},
  output: {schema: StructureAdvisorOutputSchema},
  prompt: `You are an expert writing advisor specializing in structural improvements.

  Provide structural suggestions for the following text, such as reordering paragraphs or adding transitions, to improve the flow and coherence. Return suggestions as a numbered list.

  Text: {{{text}}}
  `,
});

const structureAdvisorFlow = ai.defineFlow(
  {
    name: 'structureAdvisorFlow',
    inputSchema: StructureAdvisorInputSchema,
    outputSchema: StructureAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
