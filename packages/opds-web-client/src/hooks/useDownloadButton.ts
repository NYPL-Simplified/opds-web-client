import { MediaLink, FulfillmentLink, MediaType } from "./../interfaces";
import { useActions } from "../components/context/ActionsContext";
import download from "../components/download";
import { generateFilename, typeMap } from "../utils/file";

export function fixMimeType(mimeType: MediaType): MediaType {
  return mimeType === "vnd.adobe/adept+xml"
    ? "application/vnd.adobe.adept+xml"
    : mimeType;
}

function isIndirect(
  link: MediaLink | FulfillmentLink
): link is FulfillmentLink {
  return !!(
    (link as FulfillmentLink).indirectType &&
    link.type === "application/atom+xml;type=entry;profile=opds-catalog"
  );
}

export const STREAMING_MEDIA_LINK_TYPE: MediaType =
  "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";

const isMac = navigator.platform.indexOf("Mac") > -1;
function isPlatformCompatible(link: MediaLink | FulfillmentLink) {
  if (isMac && fixMimeType(link.type) === "application/vnd.adobe.adept+xml")
    return false;
  return true;
}

type DownloadDetails = {
  fulfill: () => Promise<void>;
  isIndirect: boolean;
  downloadLabel: string;
  mimeType: MediaType;
  fileExtension: string;
  isPlatformCompatible: boolean;
  isStreaming: boolean;
};
/**
 * We use typescript function overloads to show that if you pass in a link
 * you are guaranteed to get the download button details in an object. If
 * you might pass in undefined, you might get null
 */
export default function useDownloadButton(
  link: MediaLink | FulfillmentLink,
  title: string
): DownloadDetails;
export default function useDownloadButton(
  link: MediaLink | FulfillmentLink | undefined,
  title: string
): DownloadDetails | null;
export default function useDownloadButton(
  link: MediaLink | FulfillmentLink | undefined,
  title: string
) {
  const { actions, dispatch } = useActions();

  if (!link) {
    return null;
  }

  const mimeTypeValue = fixMimeType(link.type);

  // this ?? syntax is similar to x || y, except that it will only
  // fall back if the predicate is undefined or null, not if it
  // is falsy (false, 0, etc). Called nullish-coalescing
  const fileExtension = typeMap[mimeTypeValue]?.extension ?? "";

  const fulfill = async () => {
    if (isIndirect(link)) {
      const action = actions.indirectFulfillBook(link.url, link.indirectType);
      const url = await dispatch(action);
      window.open(url, "_blank");
    } else {
      // TODO: use mimeType variable once we fix the link type in our
      // OPDS entries
      const action = actions.fulfillBook(link.url);
      const blob = await dispatch(action);
      download(
        blob,
        generateFilename(title ?? "untitled", fileExtension),
        mimeTypeValue
      );
    }
  };

  const isStreaming =
    (isIndirect(link) && link.indirectType === STREAMING_MEDIA_LINK_TYPE) ||
    link.type === "application/vnd.librarysimplified.axisnow+json";

  const typeName = typeMap[mimeTypeValue]?.name;
  const downloadLabel = isStreaming
    ? "Read Online"
    : `Download${typeName ? " " + typeName : ""}`;

  return {
    fulfill,
    isIndirect: isIndirect(link),
    isStreaming,
    downloadLabel,
    mimeType: mimeTypeValue,
    fileExtension,
    isPlatformCompatible: isPlatformCompatible(link)
  };
}
