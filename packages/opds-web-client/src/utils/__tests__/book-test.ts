import { expect } from "chai";
import { getMedium, getMediumSVG } from "../book";
import { BookData, BookMedium } from "../../interfaces";
import { shallow, mount } from "enzyme";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary:
    "<strong>Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.</strong><br />Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.<br />The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  openAccessLinks: [
    { url: "secrets.epub", type: "application/epub+zip" },
    { url: "secrets.mobi", type: "application/x-mobipocket-ebook" }
  ],
  borrowUrl: "borrow url",
  publisher: "Penguin Publishing Group",
  published: "February 29, 2016",
  categories: ["category 1", "category 2"],
  series: {
    name: "Fake Series"
  },
  language: "de",
  raw: {
    $: { "schema:additionalType": { value: "http://bib.schema.org/Audiobook" } }
  }
};

describe("book utils", () => {
  describe("getMedium function", () => {
    it("returns value with data or an empty string", () => {
      expect(getMedium({} as BookData)).to.equal("");
      expect(getMedium({ raw: {} } as BookData)).to.equal("");
      expect(getMedium({ raw: { $: {} } } as BookData)).to.equal("");
      expect(
        getMedium({ raw: { $: { "schema:additionalType": {} } } } as BookData)
      ).to.equal("");
      expect(getMedium(book)).to.equal("http://bib.schema.org/Audiobook");
    });
  });

  describe("getMediumSVG function", () => {
    it("returns null with no input", () => {
      expect(getMediumSVG((undefined as unknown) as BookMedium)).to.equal(null);
    });

    it("returns null with bad medium input", () => {
      expect(getMediumSVG("video" as BookMedium)).to.equal(null);
    });

    it("returns a component with the appropriate svg and label for the medium input", () => {
      expect(
        mount(getMediumSVG("http://bib.schema.org/Audiobook")).text()
      ).to.equal("Audio/Headphone Icon Audio");
    });

    it("returns a component with the appropriate svg but no label for the medium input", () => {
      expect(
        mount(getMediumSVG("http://bib.schema.org/Audiobook", false)).text()
      ).to.equal("Audio/Headphone Icon ");
    });
  });
});
