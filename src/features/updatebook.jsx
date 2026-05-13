import { useFormik } from "formik"
import "../adminaddingbook.css"
import { useAddbookMutation, useLazyGetAllBooksQuery, useUpdateBookMutation } from "../services/bookApi"
import { useNavigate, useParams } from "react-router-dom";
function Updatebook({})
{
    const { id } = useParams();   
     var [updatebookFn]=useUpdateBookMutation();
     var [newbookFn]=useLazyGetAllBooksQuery();
     var navigate=useNavigate();
    var update_book=useFormik({
        initialValues:{
            bookname:"",
            author:"",
            quantity:"",
            details:"",
            bookimg:""
        },
        onSubmit:()=>{
            console.log("vachindhi reyyy",update_book)
             const formData = new FormData();
            formData.append("bookname", update_book.values.bookname);
            formData.append("author", update_book.values.author);
            formData.append("quantity", update_book.values.quantity);
            formData.append("details", update_book.values.details);
            formData.append("bookimg", update_book.values.bookimg);
            for(let pair of formData.entries()){
               console.log(pair[0], pair[1]);
            } 
            updatebookFn({id,formData}).then((res)=>{
               console.log(res)
               newbookFn();
               navigate("/admindash/getallbooks")
            })
        }
    })
    return(
        <div className="container">
            <form onSubmit={update_book.handleSubmit}  className="addbook-container" encType="multipart/form-data">
                 <h2 className="title">Update Book</h2>
                <input type="text" placeholder="Book Name" name="bookname" onChange={update_book.handleChange} className="input"></input>
                <input type="text" placeholder="Author" name="author" onChange={update_book.handleChange} className="input"></input>
                <input type="number" placeholder="number of copies" name="quantity" onChange={update_book.handleChange} className="input"></input>
                <textarea type="text" placeholder="Description" name="details" onChange={update_book.handleChange} className="input textarea"></textarea>
                <input type="file" name="bookimg" onChange={(e) => {update_book.setFieldValue("bookimg", e.currentTarget.files[0]);}} className="file"></input><br></br>
                <button className="button">Update Book</button>
            </form>
        </div>
    )
}
export default Updatebook