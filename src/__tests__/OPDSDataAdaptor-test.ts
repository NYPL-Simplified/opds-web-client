jest.dontMock('../OPDSDataAdapter');

import {
  OPDSArtworkLink,
  OPDSLink,
  Contributor,
  Summary,
  OPDSEntry,
  AcquisitionFeed,
  NavigationFeed
} from "opds-feed-parser";
import { feedToCollection } from '../OPDSDataAdapter';

let artworkUrl = 'https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg';

let artworkLink = new OPDSArtworkLink({
  href: artworkUrl,
  rel: 'http://opds-spec.org/image',
  type: '',
  title: ''
});

let entry = new OPDSEntry({
  id: 'urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9',
  updated: '',
  title: 'The Mayan Secrets',
  authors: [new Contributor({name: 'Clive Cussler', uri: ''}), new Contributor({name: 'Thomas Perry', uri: ''})],
  contributors: [],
  categories: [],
  identifiers: [],
  issued: '',
  language: '',
  rights: '',
  published: '',
  summary: new Summary({content: '&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.', link: ''}),
  links: [artworkLink],
  unparsed: {}
});

let acquisitionFeed = new AcquisitionFeed({
  id: 'feed.xml',
  title: 'Feed',
  updated: '',
  entries: [entry],
  links: [],
  complete: true,
  unparsed: {}
});

let navigationLink = new OPDSLink({
  rel: 'subsection',
  title: 'title',
  href: 'href',
  type: ''
});

let linkEntry = new OPDSEntry({
  id: 'feed.xml',
  updated: '',
  title: 'Feed',
  authors: [],
  contributors: [],
  categories: [],
  identifiers: [],
  issued: '',
  language: '',
  summary: undefined,
  rights: '',
  published: '',
  links: [navigationLink],
  unparsed: {}
});

let navigationFeed = new NavigationFeed({
  id: 'feed.xml',
  title: 'Feed',
  updated: '',
  entries: [linkEntry],
  links: [],
  complete: true,
  unparsed: {}
});


describe('OPDSDataAdapter', () => {
  it('extracts book info', () => {
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
    let collection = feedToCollection(navigationFeed, '');
    expect(collection.links.length).toEqual(1);
    let link = collection.links[0];
    expect(link.id).toEqual(linkEntry.id);
    expect(link.title).toEqual(linkEntry.title);
    expect(link.href).toEqual(navigationLink.href);
    expect(link.title).toEqual(linkEntry.title);
  });
});