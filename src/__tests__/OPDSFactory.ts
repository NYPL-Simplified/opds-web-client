import {
  OPDSArtworkLink,
  OPDSLink,
  Contributor,
  Summary,
  OPDSEntry,
  AcquisitionFeed,
  NavigationFeed
} from "opds-feed-parser";

/*
Utilities for obtaining instances of classes from opds-feed-parser.
Most of the constructor arguments use the class as their type,
so casting arguments to the class lets us avoid including
required arguments for properties we aren't testing.
*/

export function artworkLink(props: any): OPDSArtworkLink {
  return new OPDSArtworkLink(<OPDSArtworkLink>props);
}

export function entry(props: any): OPDSEntry {
  return new OPDSEntry(<OPDSEntry>props);
}

export function acquisitionFeed(props: any): AcquisitionFeed {
  return new AcquisitionFeed(<AcquisitionFeed>props);
}

export function link(props: any): OPDSLink {
  return new OPDSLink(<OPDSLink>props);
}

export function navigationFeed(props: any): NavigationFeed {
  return new NavigationFeed(<NavigationFeed>props);
}

export function contributor(props: any): Contributor {
  return new Contributor(<Contributor>props);
}

export function summary(props: any): Summary {
  return new Summary(<Summary>props);
}