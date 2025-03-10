import { useState } from "react";
import { Button, Checkbox, Input, Tooltip, Modal, Empty } from "antd";
import styles from "./Order.module.css";
import { MinusIcon, PlusIcon } from "./Icons";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartQuantity,
  removeFromCart,
  setSelectedItems,
  setCheckoutProducts,
  setTotalPrice,
} from "../../redux/order/orderSlice";
import { useNavigate } from "react-router-dom";

// Add this utility function at the top of your file
const formatVNDCurrency = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const Order = () => {
  // Replace useState products with Redux selector
  const cartItems = useSelector((state) => state.order.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Transform cart items to match the required format
  const products = cartItems.map((item) => ({
    id: item._id,
    name: item.detail.mainText,
    price: item.detail.price,
    formattedPrice: formatVNDCurrency(item.detail.price),
    variant: item.detail.category,
    image: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
      item.detail.thumbnail
    }`,

    quantityValue: item.quantity,
  }));

  // Replace the local state with Redux state
  const selectedItems = useSelector((state) => state.order.selectedItems);

  // Add state for managing input values
  const [inputValues, setInputValues] = useState({});

  // Add state for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update all references to use the new name
  const handleSelectAll = (checked) => {
    if (checked) {
      const allProductIds = products.map((product) => product.id);
      dispatch(setSelectedItems(allProductIds));
      dispatch(setCheckoutProducts(products));
    } else {
      dispatch(setSelectedItems([]));
      dispatch(setCheckoutProducts([]));
    }
  };

  const handleSelectItem = (productId, checked) => {
    const newSelected = checked
      ? [...selectedItems, productId]
      : selectedItems.filter((id) => id !== productId);
    dispatch(setSelectedItems(newSelected));

    const selectedProducts = products.filter((product) =>
      newSelected.includes(product.id)
    );
    dispatch(setCheckoutProducts(selectedProducts));
  };

  const isAllSelected =
    products.length > 0 && selectedItems.length === products.length;

  // Handle direct quantity input change
  const handleQuantityChange = (productId, value) => {
    setInputValues((prev) => ({
      ...prev,
      [productId]: value,
    }));

    if (value === "") return;

    const newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity <= 0) return;

    // Find the product to get its max quantity
    const product = cartItems.find((item) => item._id === productId);
    const maxQuantity = product?.detail?.quantity || 999;

    // Ensure quantity doesn't exceed max limit
    const validatedQuantity = Math.min(newQuantity, maxQuantity);

    dispatch(
      updateCartQuantity({
        _id: productId,
        quantity: validatedQuantity,
      })
    );
  };

  // Add delete handler
  const handleDeleteProduct = (productId) => {
    dispatch(removeFromCart(productId));
    // Remove from selected items if it was selected
    const newSelected = selectedItems.filter((id) => id !== productId);
    dispatch(setSelectedItems(newSelected));

    // Update checkout products after deletion
    const remainingSelectedProducts = products.filter((product) =>
      newSelected.includes(product.id)
    );
    dispatch(setCheckoutProducts(remainingSelectedProducts));
  };

  // Handle purchase button click
  const handlePurchaseClick = () => {
    if (selectedItems.length === 0) {
      setIsModalOpen(true);
    } else {
      // Calculate total price
      const totalPrice = products
        .filter((product) => selectedItems.includes(product.id))
        .reduce(
          (sum, product) => sum + product.price * product.quantityValue,
          0
        );

      // Filter selected products and store them in Redux
      const selectedProducts = products.filter((product) =>
        selectedItems.includes(product.id)
      );

      // Dispatch all updates to Redux store
      dispatch(setCheckoutProducts(selectedProducts));
      dispatch(setSelectedItems(selectedItems));
      dispatch(setTotalPrice(totalPrice));
      dispatch(setSelectedItems([]));

      navigate("/checkout");
    }
  };

  return (
    <div className={styles.orderContainer}>
      {/* Left Section - Product List */}
      <div className={styles.productSection}>
        {/* Header */}
        <div className={styles.productHeader}>
          <div className={styles.headerItem}>
            <Checkbox
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
          <div className={`${styles.headerItem} ${styles.productCol}`}>
            Sản Phẩm
          </div>
          <div className={`${styles.headerItem} ${styles.priceCol}`}>
            Đơn Giá
          </div>
          <div className={`${styles.headerItem} ${styles.quantityCol}`}>
            Số Lượng
          </div>
          <div className={`${styles.headerItem} ${styles.totalCol}`}>
            Số Tiền
          </div>
          <div className={`${styles.headerItem} ${styles.actionCol}`}>
            Thao Tác
          </div>
        </div>

        {/* Product Items */}
        <div className={styles.productItems}>
          {products.length === 0 ? (
            <Empty
              description="Không có sản phẩm trong giỏ hàng"
              className={styles.emptyCart}
            />
          ) : (
            products.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <div className={styles.itemCheckbox}>
                  <Checkbox
                    checked={selectedItems.includes(product.id)}
                    onChange={(e) =>
                      handleSelectItem(product.id, e.target.checked)
                    }
                  />
                </div>
                <div className={styles.itemDetails}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <Tooltip title={product.name} placement="bottomLeft">
                      <div className={styles.productName}>{product.name}</div>
                    </Tooltip>
                    <div className={styles.productVariant}>
                      <span>Phân loại hàng: {product.variant}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.itemPrice}>{product.formattedPrice}</div>
                <div className={styles.itemQuantity}>
                  <div className={styles.quantityInput}>
                    <button
                      type="button"
                      className={styles.quantityButton}
                      aria-label="Decrease"
                      disabled={product.quantityValue <= 1}
                      onClick={() =>
                        dispatch(
                          updateCartQuantity({
                            _id: product.id,
                            quantity: Math.max(1, product.quantityValue - 1),
                          })
                        )
                      }
                    >
                      <MinusIcon />
                    </button>
                    <input
                      className={styles.quantityValue}
                      type="number"
                      role="spinbutton"
                      aria-valuenow={product.quantityValue}
                      value={inputValues[product.id] ?? product.quantityValue}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                      onBlur={(e) => {
                        if (
                          e.target.value === "" ||
                          parseInt(e.target.value) <= 0
                        ) {
                          handleQuantityChange(product.id, "1");
                        }
                        setInputValues((prev) => ({
                          ...prev,
                          [product.id]: undefined,
                        }));
                      }}
                      min="1"
                      max={product.detail?.quantity || 999}
                    />
                    <button
                      type="button"
                      className={styles.quantityButton}
                      aria-label="Increase"
                      disabled={
                        product.quantityValue >=
                        (cartItems.find((item) => item._id === product.id)
                          ?.detail?.quantity || 999)
                      }
                      onClick={() => {
                        const currentProduct = cartItems.find(
                          (item) => item._id === product.id
                        );
                        const maxQuantity =
                          currentProduct?.detail?.quantity || 999;
                        const newQuantity = Math.min(
                          currentProduct.quantity + 1,
                          maxQuantity
                        );

                        if (currentProduct.quantity < maxQuantity) {
                          dispatch(
                            updateCartQuantity({
                              _id: product.id,
                              quantity: newQuantity,
                            })
                          );
                        }
                      }}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  {formatVNDCurrency(product.price * product.quantityValue)}
                </div>
                <div className={styles.itemActions}>
                  <Button
                    type="text"
                    danger
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className={styles.orderSummary}>
        <div className={styles.summarySection}>
          <div className={styles.provisionalCalculation}>
            <h3>Tạm tính</h3>
            <span>
              {formatVNDCurrency(
                products
                  .filter((product) => selectedItems.includes(product.id))
                  .reduce(
                    (sum, product) =>
                      sum + product.price * product.quantityValue,
                    0
                  )
              )}
            </span>
          </div>
          <div className={styles.totalAmount}>
            <h2>Tổng tiền</h2>
            <span className={styles.totalPrice}>
              {formatVNDCurrency(
                products
                  .filter((product) => selectedItems.includes(product.id))
                  .reduce(
                    (sum, product) =>
                      sum + product.price * product.quantityValue,
                    0
                  )
              )}
            </span>
          </div>
          <Button
            type="primary"
            size="large"
            className={styles.purchaseButton}
            onClick={handlePurchaseClick}
          >
            {products.length > 0
              ? `Mua hàng (${selectedItems.length})`
              : "Không có sản phẩm"}
          </Button>
        </div>
      </div>

      {/* Add Modal component */}
      <Modal
        title={null}
        open={isModalOpen}
        footer={null}
        closable={false}
        centered
        className={styles.alertModal}
      >
        <div className={styles.alertContent}>
          <div className={styles.alertMessage}>
            Bạn vẫn chưa chọn sản phẩm nào để mua.
          </div>
          <Button type="primary" onClick={() => setIsModalOpen(false)}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Order;
