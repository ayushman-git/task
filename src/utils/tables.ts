import { Table } from "https://deno.land/x/cliffy@v0.25.4/table/mod.ts";

export const generateTable = (headers: string[], body: Array<string[]>) => {
  new Table()
    .header(headers)
    .body(body)
    .maxColWidth(10)
    .padding(1)
    .indent(2)
    .border(true)
    .render();
};
