const { nanoid } = require('nanoid');
const books = require('./notes');

const addBookHandler = (request, h) => {
  const { 
    name, 
    year, 
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (readPage===pageCount);
 
if(request.payload.name === undefined){
  const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
  });
  response.code(400);
  return response;
}

if(request.payload.readPage > request.payload.pageCount){
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
response.code(400);
return response;
}

  const newBook = {
    name,
    year, 
    author, 
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    id, insertedAt, updatedAt
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request,h) => {
  const { 
    name,
    reading,
    finished
  } = request.query;

  let bookClustered = books;

  if (name !== undefined){
      bookClustered = bookClustered.filter((buku) => buku.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined){
      bookClustered = bookClustered.filter((buku) =>Number(buku.reading)===Number(reading));
  }

  if (finished !== undefined){
    bookClustered = bookClustered.filter((buku) =>Number(buku.finished)===Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookClustered.map((buku) => ({
            id:buku.id,
            name:buku.name,
            publisher:buku.publisher
      }))
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book =books.filter((buku)=> buku.id===bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {book}
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
 
  const { 
    name, 
    year, 
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,  
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = (readPage===pageCount);
    
  if (request.payload.name===undefined) {

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'   
    });
    response.code(400);
    return response;

}

if (request.payload.readPage>request.payload.pageCount) {

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
 
    });
    response.code(400);
    return response;

}

  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
 
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name , 
      year, 
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt
    };
  
    const response = h.response({    
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
