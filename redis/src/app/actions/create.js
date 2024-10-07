'use server';

import { client } from "../../lib/db";  // Ensure this points to the correct file
import { redirect } from 'next/navigation';

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData);

  // Create book id
  const id = Math.floor(Math.random() * 100000);

  // Addthe book to the sorted set
  const unique = await client.zadd('books', {
    value: title,
    score: id
  }, {NX : true})

  if (!unique) {
    return {error: "That bok is already aded"}
  }

  // Save the new book using hSet
  await client.hset(`books:${id}`, {
    title,
    rating,
    author,
    blurb,
  });

  redirect("/");
}
