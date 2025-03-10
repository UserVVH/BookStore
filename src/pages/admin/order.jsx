import { useDispatch, useSelector } from "react-redux";
import OrderTable from "../../components/admin/Order/OrderTable";
import { useEffect } from "react";
import { fetchAllOrders } from "../../redux/ManageOrderAdmin/orderAdminSlice";
import OrderSearch from "../../components/admin/Order/OrderSearch";

const Order = () => {
  const { currentPage, pageSize, querySearch, sortField } = useSelector(
    (state) => state.orderAdmin
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders({ currentPage, pageSize, querySearch, sortField }));
  }, [currentPage, pageSize, querySearch, sortField]);

  return (
    <>
      <OrderSearch />
      <OrderTable />
    </>
  );
};

export default Order;
