import { useEffect, useState } from "react";
import UserSearch from "../../components/admin/user/UserSearch";
import UserTable from "../../components/admin/user/UserTable";
import { getAllUser } from "../../service/user-service";
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setCurrentPage,
  setPageSize,
  setTotalData,
  setQuerySearch,
  setSortField,
  setLoading,
  fetchAllUsers,
} from "../../redux/user/userSlice";

const User = () => {
  // const [data, setData] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(5);
  // const [totalData, setTotalData] = useState("");
  // const [querySearch, setQuerySearch] = useState(null);
  // const [sortField, setSortField] = useState(null);
  // const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();
  const {
    data,
    currentPage,
    pageSize,
    totalData,
    querySearch,
    sortField,
    loading,
  } = useSelector((state) => state.user);

  useEffect(() => {
    // handleGetAllUser();
    dispatch(fetchAllUsers({ currentPage, pageSize, querySearch, sortField }));
  }, [currentPage, pageSize, querySearch, sortField]);

  // const handleGetAllUser = async () => {
  //   //hiệu ứng loading table
  //   // setLoading(true);
  //   dispatch(setLoading(true));

  //   const res = await getAllUser(currentPage, pageSize, querySearch, sortField);
  //   if (res.data) {
  //     // setData(res.data.result);
  //     dispatch(setData(res.data.result));
  //     dispatch(setTotalData(res.data.meta.total));
  //     // setTotalData(res.data.meta.total);
  //   }
  //   dispatch(setLoading(false));
  //   // setLoading(false);
  // };

  return (
    <>
      <UserSearch
      // setQuerySearch={setQuerySearch}
      // setCurrentPage={setCurrentPage}
      // setPageSize={setPageSize}
      />
      <UserTable
      // data={data}
      // currentPage={currentPage}
      // pageSize={pageSize}
      // totalData={totalData}
      // setCurrentPage={setCurrentPage}
      // setPageSize={setPageSize}
      // loading={loading}
      // setQuerySearch={setQuerySearch}
      // setSortField={setSortField}
      // handleGetAllUser={handleGetAllUser}
      />
    </>
  );
};
export default User;
