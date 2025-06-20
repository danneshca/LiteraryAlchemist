
'use server';

/**
 * @fileOverview Rhythm adjustment AI agent.
 *
 * - adjustRhythm - A function that handles the rhythm adjustment process.
 * - AdjustRhythmInput - The input type for the adjustRhythm function.
 * - AdjustRhythmOutput - The return type for the adjustRhythm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustRhythmInputSchema = z.object({
  text: z.string().describe('The text to adjust the rhythm of.'),
});
export type AdjustRhythmInput = z.infer<typeof AdjustRhythmInputSchema>;

const AdjustRhythmOutputSchema = z.object({
  adjustedText: z.string().describe('The text with adjusted rhythm and pacing.'),
  suggestions: z.array(z.string()).describe('Suggestions on where to add pauses, emphasis, or variations.'),
});
export type AdjustRhythmOutput = z.infer<typeof AdjustRhythmOutputSchema>;

export async function adjustRhythm(input: AdjustRhythmInput): Promise<AdjustRhythmOutput> {
  return adjustRhythmFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustRhythmPrompt',
  input: {schema: AdjustRhythmInputSchema},
  output: {schema: AdjustRhythmOutputSchema},
  prompt: `You are an expert in rhythm and pacing in writing. Your task is to adjust the rhythm and pacing of the given text and provide suggestions on where to add pauses, emphasis, or variations to create a more engaging and impactful reading experience.

IMPORTANT: The output language for both the adjusted text and suggestions MUST be the same as the input language.

Text: {{{text}}}

Adjusted Text (with rhythm and pacing adjustments):
{{adjustedText}}

Suggestions:
{{#each suggestions}}
- {{this}}
{{/each}}`,
});

const adjustRhythmFlow = ai.defineFlow(
  {
    name: 'adjustRhythmFlow',
    inputSchema: AdjustRhythmInputSchema,
    outputSchema: AdjustRhythmOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

