import { type SchemaTypeDefinition } from "sanity";

import  project  from "./project";

export const schema: { types: SchemaTypeDefinition[] } = {
  // 2. Masukkan variabel dokumennya ke dalam array types di sini
  types: [project],
};
