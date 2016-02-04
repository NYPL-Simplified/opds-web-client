jest.dontMock('../OPDSDataAdapter');
jest.dontMock('./MockOPDS');

import * as factory from "./OPDSFactory";
import { feedToCollection } from '../OPDSDataAdapter';


describe('OPDSDataAdapter', () => {
  it('extracts book info', () => {
    let artworkUrl = 'https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg';

    let artworkLink = factory.artworkLink({
      href: artworkUrl,
      rel: 'http://opds-spec.org/image',
    });

    let entry = factory.entry({
      id: 'urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9',
      title: 'The Mayan Secrets',
      authors: [factory.contributor({name: 'Clive Cussler'}), factory.contributor({name: 'Thomas Perry'})],
      summary: factory.summary({content: '&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.'}),
      links: [artworkLink]
    });

    let acquisitionFeed = factory.acquisitionFeed({
      entries: [entry],
    });

    let collection = feedToCollection(acquisitionFeed, '');
    expect(collection.books.length).toEqual(1);
    let book = collection.books[0];
    expect(book.id).toEqual(entry.id);
    expect(book.title).toEqual(entry.title);
    expect(book.authors.length).toEqual(2);
    expect(book.authors[0]).toEqual(entry.authors[0].name);
    expect(book.authors[1]).toEqual(entry.authors[1].name);
    expect(book.summary).toEqual(entry.summary);
    expect(book.imageUrl).toEqual(artworkUrl);
  });

  it('extracts link info', () => {
    let navigationLink = factory.link({
      href: 'href',
    });

    let linkEntry = factory.entry({
      id: 'feed.xml',
      title: 'Feed',
      links: [navigationLink],
    });

    let navigationFeed = factory.navigationFeed({
      entries: [linkEntry],
    });

    let collection = feedToCollection(navigationFeed, '');
    expect(collection.links.length).toEqual(1);
    let link = collection.links[0];
    expect(link.id).toEqual(linkEntry.id);
    expect(link.title).toEqual(linkEntry.title);
    expect(link.href).toEqual(navigationLink.href);
    expect(link.title).toEqual(linkEntry.title);
  });
});