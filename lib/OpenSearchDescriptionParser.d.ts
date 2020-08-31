import { SearchData } from "./interfaces";
/** Converts an open search description document into the application's internal
    representation. */
export default class OpenSearchDescriptionParser {
    parse(xml: string, descriptionUrl: string): Promise<SearchData>;
}
