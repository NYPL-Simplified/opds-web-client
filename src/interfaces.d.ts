interface Book {
  id: string,
  title: string,
  authors: string[],
  summary: string,
  imageUrl: string,
  publisher: string
}

interface Link {
  id: string,
  title: string,
  href: string
}

interface Lane {
  title: string,
  books: Book[],
}

interface Collection {
  id: string,
  title: string,
  lanes: Lane[],
  links: Link[],
  books: Book[],
}