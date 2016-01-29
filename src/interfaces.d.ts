interface Book {
  id: string,
  title: string,
  author: string,
  summary: string,
  imageUrl: string,
  publisher: string
}

interface Lane {
  title: string,
  books: Book[],
}

interface Collection {
  title: string,
  lanes: Lane[],
  books: Book[],
}