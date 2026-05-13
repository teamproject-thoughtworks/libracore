import { useFormik } from "formik"
import "../adminaddingbook.css"
import { useAddbookMutation, useLazyGetAllBooksQuery } from "../services/bookApi"
import { useNavigate } from "react-router-dom";
function Addbook()
{
     var[addbookFn]=useAddbookMutation();
     var [getNewbooksQuey]=useLazyGetAllBooksQuery();
     var navigate=useNavigate();
    var add_book=useFormik({
        initialValues:{
            bookname:"",
            author:"",
            quantity:"",
            details:"",
            bookimg:""
        },
        onSubmit:()=>{
            console.log("vachindhi reyyy",add_book)
             const formData = new FormData();
            formData.append("bookname", add_book.values.bookname);
            formData.append("author", add_book.values.author);
            formData.append("quantity", add_book.values.quantity);
            formData.append("details", add_book.values.details);
            formData.append("bookimg", add_book.values.bookimg);
            for(let pair of formData.entries()){
               console.log(pair[0], pair[1]);
            } 
            addbookFn(formData).then((res)=>{
                if(res.error.data)
                     alert("book added sucessfully")
                getNewbooksQuey();
                navigate("/admindash/getallbooks")    
            })
        }
    })
    return(
        <div className="container">
            <form onSubmit={add_book.handleSubmit}  className="addbook-container" encType="multipart/form-data">
                 <h2 className="title">Add Book</h2>
                <input type="text" placeholder="Book Name" name="bookname" onChange={add_book.handleChange} className="input"></input>
                <input type="text" placeholder="Author" name="author" onChange={add_book.handleChange} className="input"></input>
                <input type="number" placeholder="number of copies" name="quantity" onChange={add_book.handleChange} className="input"></input>
                <textarea type="text" placeholder="Description" name="details" onChange={add_book.handleChange} className="input textarea"></textarea>
                <input type="file" name="bookimg" onChange={(e) => {add_book.setFieldValue("bookimg", e.currentTarget.files[0]);}} className="file"></input><br></br>
                <button className="button">Add Book</button>
            </form>
        </div>
    )
}
export default Addbook