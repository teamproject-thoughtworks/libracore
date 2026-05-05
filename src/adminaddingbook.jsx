import { useFormik } from "formik"
import './adminaddingbook.css'
function Addbook()
{
    var add_book=useFormik({
        initialValues:{
            bookname:"",
            author:"",
            quantity:"",
            details:"",
            photo:""
        },
        onSubmit:()=>{
            console.log("vachindhi reyyy",add_book)
        }
    })
    return(
        <div className="container">
            <form onSubmit={add_book.handleSubmit}  className="addbook-container">
                 <h2 className="title">Add Book</h2>
                <input type="text" placeholder="Book Name" name="bookname" onChange={add_book.handleChange} className="input"></input>
                <input type="text" placeholder="Author" name="author" onChange={add_book.handleChange} className="input"></input>
                <input type="number" placeholder="number of copies" name="quantity" onChange={add_book.handleChange} className="input"></input>
                <textarea type="text" placeholder="Description" name="details" onChange={add_book.handleChange} className="input textarea"></textarea>
                <input type="file" name="photo" onChange={(e) => {add_book.setFieldValue("photo", e.currentTarget.files[0]);}} className="file"></input><br></br>
                <button className="button">Add Book</button>
            </form>
        </div>
    )
}
export default Addbook