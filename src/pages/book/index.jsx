import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import axios from "../../utils/axios-customize";
import ViewDetails from "../../components/Book/ViewDetails";

const BookPage = () => {
  const [searchParams] = useSearchParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      const id = searchParams.get("id");
      if (id) {
        try {
          const res = await axios.get(`/api/v1/book/${id}`);
          if (res?.data) {
            setBook(res.data);
          }
        } catch (error) {
          console.error("Error fetching book:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBook();
  }, [searchParams]);

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <>
      {/* <h1>{book.mainText}</h1> */}
      <ViewDetails book={book} />
      {/* Add more book details here */}
    </>
  );
};

export default BookPage;
