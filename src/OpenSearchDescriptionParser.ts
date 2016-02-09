import * as xml2js from 'xml2js';
import * as url from 'url';

let xmlParser = new xml2js.Parser({xmlns: true});

export default class OpenSearchDescriptionParser {
  parse(xml: string, descriptionUrl: string): Promise<SearchProps> {
    return new Promise((resolve, reject) => {
      xmlParser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.OpenSearchDescription) {
            let root = result.OpenSearchDescription;
            let description = root["Description"][0]["_"];
            let shortName = root["ShortName"][0]["_"]
            let templateString = root["Url"][0]["$"].template.value
            let template = (s: string) => {
              return url.resolve(descriptionUrl, templateString.replace("{searchTerms}", s));
            };
            resolve({
              description, shortName, template
            });
          }
        }
      });
    });
  }
}