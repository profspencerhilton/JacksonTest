using BookStore.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        
        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string projectTypes = null)
        {
            IQueryable<Book> query = _bookContext.Books;
            if (!string.IsNullOrEmpty(projectTypes))
            {
                var types = projectTypes.Split(',', StringSplitOptions.RemoveEmptyEntries);
                query = query.Where(b => types.Contains(b.Category));
            }
            var books = query.Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            var totalNumBooks = query.Count();
            return Ok(new { Books = books, TotalNumBooks = totalNumBooks });
        }
        
        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            
            return Ok(bookCategories);
            
        }
        
        [HttpGet("GetBookByID")]
        public IActionResult GetBookByID(int bookID)
        {
            var book = _bookContext.Books.FirstOrDefault(b => b.BookID == bookID);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook) {
            _bookContext.Books.Add(newBook); // Add the new project to the DbContext
            _bookContext.SaveChanges(); // Save the changes to the database
            return Ok(newBook); // Return the newly added project as a response
        }

        [HttpPut("UpdateBook/{bookID}")] // Use HttpPut for updating a resource
        public IActionResult UpdateBook([FromBody] Book updatedBook) {
            var existingBook = _bookContext.Books.FirstOrDefault(b => b.BookID == updatedBook.BookID);
            
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Price = updatedBook.Price;
            existingBook.Category = updatedBook.Category;

            _bookContext.Books.Update(existingBook); // Update the existing book in the DbContext
            _bookContext.SaveChanges();
            return Ok(existingBook);
        }
        
        [HttpDelete("DeleteBook/{bookID}")] // Use HttpDelete for deleting a resource
        public IActionResult DeleteBook(int bookID)
        {
            // Find the book to delete
            var book = _bookContext.Books.Find(bookID);
            if (book == null)
            {
                return NotFound(new {message = "Book not found."}); // Return 404 if the book doesn't exist
            }

            _bookContext.Books.Remove(book); // Remove the book from the DbContext
            _bookContext.SaveChanges(); // Save the changes to the database

            return NoContent(); // Return 204 No Content to indicate successful deletion
        }
            
    }
}
