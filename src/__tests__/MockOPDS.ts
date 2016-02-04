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
Utilities for mocking output from opds-feed-parser.
Most of the constructor arguments use the class as their type,
so casting arguments to the class lets us avoid including
required arguments for properties we aren't testing.
*/

export function mockArtworkLink(props: any): OPDSArtworkLink {
  return new OPDSArtworkLink(<OPDSArtworkLink>props);
}

export function mockEntry(props: any): OPDSEntry {
  return new OPDSEntry(<OPDSEntry>props);
}

export function mockAcquisitionFeed(props: any): AcquisitionFeed {
  return new AcquisitionFeed(<AcquisitionFeed>props);
}

export function mockLink(props: any): OPDSLink {
  return new OPDSLink(<OPDSLink>props);
}

export function mockNavigationFeed(props: any): NavigationFeed {
  return new NavigationFeed(<NavigationFeed>props);
}

export function mockContributor(props: any): Contributor {
  return new Contributor(<Contributor>props);
}

export function mockSummary(props: any): Summary {
  return new Summary(<Summary>props);
}