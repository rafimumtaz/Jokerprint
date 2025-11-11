'use server';

/**
 * @fileOverview Implements semantic product search using Genkit.
 *
 * - semanticProductSearch - A function that performs a semantic search for products.
 * - SemanticProductSearchInput - The input type for the semanticProductSearch function.
 * - SemanticProductSearchOutput - The return type for the semanticProductSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticProductSearchInputSchema = z.object({
  query: z.string().describe('The search query.'),
  products: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).describe('An array of product objects to search through.'),
});
export type SemanticProductSearchInput = z.infer<typeof SemanticProductSearchInputSchema>;

const SemanticProductSearchOutputSchema = z.array(z.object({
  name: z.string(),
  description: z.string(),
})).describe('An array of product objects that match the search query.');
export type SemanticProductSearchOutput = z.infer<typeof SemanticProductSearchOutputSchema>;

export async function semanticProductSearch(input: SemanticProductSearchInput): Promise<SemanticProductSearchOutput> {
  return semanticProductSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticProductSearchPrompt',
  input: {schema: SemanticProductSearchInputSchema},
  output: {schema: SemanticProductSearchOutputSchema},
  prompt: `You are a search assistant for an online photocopy shop. Given a search query and a list of products,
you will return a list of products that are relevant to the search query.

Search Query: {{{query}}}

Products:
{{#each products}}
- Name: {{{name}}}, Description: {{{description}}}
{{/each}}

Return only the products that are relevant to the search query. Respond in JSON format.`, // Modified prompt
});

const semanticProductSearchFlow = ai.defineFlow(
  {
    name: 'semanticProductSearchFlow',
    inputSchema: SemanticProductSearchInputSchema,
    outputSchema: SemanticProductSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
