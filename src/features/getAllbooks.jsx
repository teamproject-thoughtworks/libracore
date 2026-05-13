import { useDeleteBookMutation, useGetAllBooksQuery, useLazyGetAllBooksQuery } from "../services/bookApi";
import "../geallbooks.css"
import { useNavigate } from "react-router-dom";
function Getbook() {
    var [dletebookFn]=useDeleteBookMutation();
    const { isLoading, data } = useGetAllBooksQuery();
    const [getlatestbooksFn]=useLazyGetAllBooksQuery();
    var navigate=useNavigate();
    console.log("ma bujji edi data nana", JSON.stringify(data));
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    return (
        <div className="books-container">
            {
                data?.map((book) => (
                    <div className="book-card" key={book._id}>
                         <p>
                            <b>Author:</b> {book.author}
                        </p>
                        <img
                            src={`http://localhost:3600/${book.bookimg}`}
                            alt={book.bookname}
                            className="book-image"
                        />
                        <p>
                            <b>BookName:</b>{book.bookname}
                        </p>
                        <p>
                            <b>Quantity:</b> {book.quantity}
                        </p>
                        <p>
                            <b>Details:</b> {book.details}
                        </p>
                        <div className="button-group">
                            <button onClick={()=>{
                                 dletebookFn(book.bookname)
                                 getlatestbooksFn();
                            }}>DELETE</button>
                            <button
                              onClick={()=>{
                                navigate(`/admindash/updatebook/${book._id}`)
                              }}
                            >UPDATE</button>
                        </div>
                    </div>
                ))
            }

        </div>
    );
}

export default Getbook;