
// src/app/actions.ts
"use server";

import { styleTransform, type StyleTransformInput, type StyleTransformOutput } from '@/ai/flows/style-transformer';
import { structureAdvisor, type StructureAdvisorInput, type StructureAdvisorOutput } from '@/ai/flows/structure-advisor';
import { adjustRhythm, type AdjustRhythmInput, type AdjustRhythmOutput } from '@/ai/flows/rhythm-adjuster';
import { deAiText, type DeAiTextInput, type DeAiTextOutput } from '@/ai/flows/deai-text-flow';

export type AiTool = "style-transformer" | "structure-advisor" | "rhythm-adjuster" | "de-ai-text";
export type TargetStyle = "Lu Xun" | "Hayao Miyazaki" | "Shakespeare" | "Edgar Allan Poe";

interface ProcessTextInput {
  text: string;
  tool: AiTool;
  targetStyle?: TargetStyle;
}

export type ProcessTextOutput = 
  | { tool: "style-transformer"; data: StyleTransformOutput }
  | { tool: "structure-advisor"; data: StructureAdvisorOutput }
  | { tool: "rhythm-adjuster"; data: AdjustRhythmOutput }
  | { tool: "de-ai-text"; data: DeAiTextOutput };


export async function processText(input: ProcessTextInput): Promise<ProcessTextOutput | { error: string }> {
  try {
    switch (input.tool) {
      case "style-transformer":
        if (!input.targetStyle) {
          return { error: "Target style is required for style transformation." };
        }
        const styleInput: StyleTransformInput = { text: input.text, targetStyle: input.targetStyle };
        const styleOutput = await styleTransform(styleInput);
        return { tool: "style-transformer", data: styleOutput };

      case "structure-advisor":
        const structureInput: StructureAdvisorInput = { text: input.text };
        const structureOutput = await structureAdvisor(structureInput);
        return { tool: "structure-advisor", data: structureOutput };

      case "rhythm-adjuster":
        const rhythmInput: AdjustRhythmInput = { text: input.text };
        const rhythmOutput = await adjustRhythm(rhythmInput);
        return { tool: "rhythm-adjuster", data: rhythmOutput };

      case "de-ai-text":
        const deAiInput: DeAiTextInput = { text: input.text };
        const deAiOutput = await deAiText(deAiInput);
        return { tool: "de-ai-text", data: deAiOutput };

      default:
        // This should ideally be caught by TypeScript, but as a fallback:
        const exhaustiveCheck: never = input.tool;
        return { error: `Invalid tool selected: ${exhaustiveCheck}` };
    }
  } catch (e: any) {
    console.error("Error processing text:", e);
    return { error: e.message || "An unexpected error occurred." };
  }
}
