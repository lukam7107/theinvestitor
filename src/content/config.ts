import { defineCollection, z } from 'astro:content';

const analize = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    ticker: z.string(),
    borza: z.string(),
    sektor: z.string(),
    datum: z.date(),
    cena: z.number(),
    valuta: z.string().default('USD'),
    marketCap: z.string(),
    fairValueMin: z.number(),
    fairValueMax: z.number(),
    fairValueValuta: z.string().default('USD'),
    bullCase: z.array(z.string()),
    bearCase: z.array(z.string()),
    povzetek: z.string(),
    demo: z.boolean().default(false),
  }),
});

export const collections = { analize };
