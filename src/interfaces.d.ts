interface Book {
  id: string,
  title: string,
  authors: string[],
  summary: string,
  imageUrl: string,
  publisher: string
}

interface Lane {
  title: string,
  books: Book[],
}

interface Collection {
  id: string,
  title: string,
  lanes: Lane[],
  books: Book[],
}