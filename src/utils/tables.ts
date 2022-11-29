import { Table } from "cliffy/table/mod.ts";

export const generateTable = (headers: string[], body: Array<string[]>) => {
  new Table()
    .header(headers)
    .body(body)
    .maxColWidth(30)
    .padding(1)
    .indent(2)
    .border(true)
    .render();
};
