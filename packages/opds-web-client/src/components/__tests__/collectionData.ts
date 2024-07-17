import { BookData } from "./../../interfaces";
import { CollectionData } from "../../interfaces";

let groupedCollectionData: CollectionData = {
  id: "/groups/",
  url: "http://circulation.librarysimplified.org/groups/",
  title: "All Books",
  lanes: [
    {
      title: "Best Sellers",
      url: "http://circulation.librarysimplified.org/feed/eng/English%20-%20Best%20Sellers?order=author",
      books: [
        {
          id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
          url: "http://circulation.librarysimplified.org/works/3M/crrmnr9",
          title: "The Mayan Secrets",
          authors: ["Clive Cussler", "Thomas Perry"],
          summary:
            "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
          imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
          publisher: "Penguin Publishing Group",
          published: "April 1, 2014",
          raw: {
            $: { "schema:additionalType": { value: "http://schema.org/EBook" } }
          }
        },
        {
          id: "urn:librarysimplified.org/terms/id/Overdrive%20ID/97ecd436-6416-4317-835c-aea13836ea5b",
          url: "http://circulation.librarysimplified.org/works/Overdrive/97ecd436-6416-4317-835c-aea13836ea5b",
          title: "So B. It",
          authors: ["Sarah Weeks"],
          summary:
            "&lt;p&gt;You couldn&amp;#8242;t really tell about Mama&amp;#8242;s brain just from looking at her&amp;#44; but it was obvious as soon as she spoke. She had a high voice&amp;#44; like a little girl&amp;#8242;s&amp;#44; and she only knew 23 words. I know this for a fact&amp;#44; because we kept a list of the things Mama said tacked to the inside of the kitchen cabinet. Most of the words were common ones&amp;#44; like good and more and hot&amp;#44; but there was one word only my mother said: soof. &lt;/p&gt;\n&lt;p&gt;Although she lives an unconventional lifestyle with her mentally disabled mother and their doting neighbour&amp;#44; Bernadette&amp;#44; Heidi has a lucky streak that has a way of pointing her in the right direction. When a mysterious word in her mother&amp;#8242;s vocabulary begins to haunt her&amp;#44; Heidi&amp;#8242;s thirst for the truth leads her on a cross&amp;#45;country journey in search of the secrets of her past.&lt;/p&gt;",
          imageUrl:
            "https://dlotdqc6pnwqb.cloudfront.net/Overdrive/97ecd436-6416-4317-835c-aea13836ea5b/cover.jpg",
          publisher: "HarperCollins",
          published: "June 9, 2014",
          raw: {
            $: { "schema:additionalType": { value: "http://schema.org/EBook" } }
          }
        },
        {
          id: "urn:librarysimplified.org/terms/id/Overdrive%20ID/59c938ed-9e93-42a9-a0a6-70ea8b7e28e4",
          url: "http://circulation.librarysimplified.org/works/Overdrive/59c938ed-9e93-42a9-a0a6-70ea8b7e28e4",
          title: "A Spy Among Friends",
          authors: ["Ben Macintyre"],
          summary:
            "&lt;p&gt;&lt;b&gt;Master storyteller Ben Macintyre's most ambitious work to date offers a powerful new angle on the 20th century's greatest spy story&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Kim Philby was the greatest spy in history, a brilliant and charming man who rose to head Britain's counterintelligence against the Soviet Union during the height of the Cold War--while he was secretly working for the enemy. And nobody thought he knew Philby like Nicholas Elliott, Philby's best friend and fellow officer in MI6. The two men had gone to the same schools, belonged to the same exclusive clubs, grown close through the crucible of wartime intelligence work and long nights of drink and revelry. It was madness for one to think the other might be a communist spy, bent on subverting Western values and the power of the free world.&lt;br /&gt;&lt;br /&gt;But Philby was secretly betraying his friend. Every word Elliott breathed to Philby was transmitted back to Moscow--and not just Elliott's words, for Philby had made another powerful friend in...",
          imageUrl:
            "https://dlotdqc6pnwqb.cloudfront.net/Overdrive/59c938ed-9e93-42a9-a0a6-70ea8b7e28e4/cover.jpg",
          publisher: "Crown/Archetype",
          published: "July 25, 2014",
          raw: {
            $: { "schema:additionalType": { value: "http://schema.org/EBook" } }
          }
        }
      ]
    }
  ],
  books: [],
  navigationLinks: [],
  catalogRootLink: {
    url: "root url",
    text: "root title"
  },
  parentLink: {
    url: "parent url",
    text: "parent title"
  }
};

// created ungrouped version of data by moving each lane's books directly into the collection
let ungroupedCollectionData: CollectionData = Object.assign(
  {},
  groupedCollectionData
);
ungroupedCollectionData.books = ungroupedCollectionData.lanes.reduce<
  BookData[]
>((results, lane) => {
  return results.concat(lane.books);
}, []);
ungroupedCollectionData.lanes = [];
ungroupedCollectionData.url = "http://circulation.librarysimplified.org/lane/";

export { groupedCollectionData, ungroupedCollectionData };
