import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks } from "../../redux/book/bookSlice";
import BookTable from "../../components/admin/book/BookTable";
import BookSearch from "../../components/admin/book/BookSearch";

const Book = () => {
  const dispatch = useDispatch();
  const { currentPage, pageSize, querySearch, sortField } = useSelector(
    (state) => state.book
  );

  useEffect(() => {
    dispatch(fetchAllBooks({ currentPage, pageSize, querySearch, sortField }));
  }, [currentPage, pageSize, querySearch, sortField]);

  return (
    <>
      <BookSearch />
      <BookTable />
    </>
  );
};
export default Book;
