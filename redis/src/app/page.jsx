import { client } from '@/lib/db'
import Link from 'next/link'

const getBooks = async () => {
  const result = await client.zrange('books', 0, -1, {withScores: true})

  const books =  await Promise.all(result.map((b) => {
    return client.hgetall(`books:${b.score}`)
  }))
  return books
}

export default async function Home() {
  const books = await getBooks();
  console.log("books", books);
  
  return (
    <main>
      <nav className="flex justify-between">
        <h1 className='font-bold'>Books on Redis!</h1>
        <Link href="/create" className="btn">Add a new book</Link>
      </nav>
      
      <p className="my-10">List of books here.</p>
      {books.map((book) => (
        <div key={book.title} className="card">
          <h2>{book.author}</h2>
          <p>By {book.author}</p>
          <p>{book.blurb}</p>
          <p>Rating: {book.rating}</p>
        </div>
      ))}
    </main>
  )
}