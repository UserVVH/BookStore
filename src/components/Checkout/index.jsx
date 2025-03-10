import { Input, Button, Form, message, notification } from "antd";
import {
  ShopOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  CarOutlined,
  DollarOutlined,
  CreditCardOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import styles from "./Checkout.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../service/order-service";
import { updateCartQuantities } from "../../redux/order/orderSlice";

const Checkout = () => {
  const { user } = useSelector((state) => state.account);
  const { checkoutProducts, totalPrice } = useSelector((state) => state.order);
  const shippingFee = 23688; // Could also come from state if it's variable

  // Add form instance
  const [form] = Form.useForm();
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper function to format price in VND
  const formatPrice = (price) => {
    return `₫${price.toLocaleString("vi-VN")}`;
  };

  // Calculate final total with shipping
  const finalTotal = totalPrice + shippingFee;

  // Helper function to format date in Vietnamese
  const formatDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);

    const formatDay = (date) => {
      return `${date.getDate()} Tháng ${date.getMonth() + 1}`;
    };

    return `${formatDay(today)} - ${formatDay(deliveryDate)}`;
  };

  // Modify the order submission handler
  const handleOrderSubmit = async () => {
    setIsLoading(true);
    try {
      await form.validateFields();

      // Prepare order data
      const orderData = {
        name: user.fullName,
        address: form.getFieldValue("address").trim(),
        phone: user.phone,
        totalPrice: finalTotal, // bên BE chưa có tính shippingFee, chỉ có quantity * price, dù FE có tính shippingFee nhưng BE vẫn trả về totalPrice = quantity * price
        detail: checkoutProducts.map((product) => ({
          bookName: product.name,
          quantity: product.quantityValue,
          _id: product.id,
        })),
      };
      const res = await createOrder(orderData);
      if (res.data) {
        // Update cart quantities after successful order
        dispatch(updateCartQuantities(checkoutProducts));

        notification.success({
          message: "Đặt hàng thành công!",
          placement: "topRight",
        });
        navigate("/order-success");
      } else {
        notification.error({
          message: "Vui lòng kiểm tra lại thông tin đặt hàng",
          placement: "topRight",
          description: JSON.stringify(res.message),
        });
      }
    } catch (error) {
      message.error("Vui lòng kiểm tra lại thông tin đặt hàng");
      console.error("Order submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Địa chỉ nhận hàng */}
      <section className={styles.section}>
        <div className={styles.gradientLine}></div>
        <div className={styles.addressHeader}>
          <EnvironmentOutlined className={styles.headerIcon} />
          <h2>Địa chỉ nhận hàng</h2>
        </div>
        <div className={styles.addressInfo}>
          <div className={styles.name}>
            {user.fullName} (+84) {user.phone.replace(/^0+/, "")}
          </div>
          <Form form={form}>
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ nhận hàng",
                  validator: (_, value) => {
                    if (!value || !value.trim()) {
                      return Promise.reject("Vui lòng nhập địa chỉ nhận hàng");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.TextArea
                className={styles.addressInput}
                placeholder="Vui lòng nhập địa chỉ của bạn"
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>
          </Form>
          <span className={styles.tag}>Mặc định</span>
        </div>
      </section>

      {/* Sản phẩm */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <GiftOutlined className={styles.headerIcon} />
          <h2>Sản phẩm</h2>
        </div>

        <div className={styles.shopInfo}>
          <ShopOutlined />
          <span className={styles.shopName}>BookAAA Store</span>
          <Button type="text" icon={<MessageOutlined />}>
            Chat ngay
          </Button>
        </div>

        {checkoutProducts.map((product, index) => (
          <div key={index} className={styles.product}>
            <img src={product.image} alt={product.name} />
            <div className={styles.productDetails}>
              <div className={styles.productName}>{product.name}</div>
              <div className={styles.priceInfo}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>
                    <DollarOutlined /> Đơn giá:
                  </span>
                  <span className={styles.priceValue}>
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>
                    <ShopOutlined /> Số lượng:
                  </span>
                  <span className={styles.priceValue}>
                    {product.quantityValue}
                  </span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>
                    <SafetyOutlined /> Thành tiền:
                  </span>
                  <span className={styles.priceValue}>
                    {formatPrice(product.price * product.quantityValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className={styles.message}>
          <span>Lời nhắn:</span>
          <Input
            placeholder="Lưu ý cho Người bán..."
            style={{ marginTop: 8 }}
          />
        </div>
      </section>

      {/* Vận chuyển */}
      <section className={styles.section}>
        <div className={styles.shippingHeader}>
          <CarOutlined className={styles.headerIcon} />
          <span>Phương thức vận chuyển</span>
          <span className={styles.shippingType}>Nhanh</span>
        </div>
        <div className={styles.shippingInfo}>
          <img
            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/checkout/41fe56ab756fc3082a08.svg"
            alt=""
          />
          <div>
            <div>Đảm bảo nhận hàng từ {formatDeliveryDate()}</div>
            <div className={styles.shippingPrice}>
              {formatPrice(shippingFee)}
            </div>
          </div>
        </div>
      </section>

      {/* Thanh toán */}
      <section className={styles.section}>
        <div className={styles.paymentHeader}>
          <DollarOutlined className={styles.headerIcon} />
          <span>Phương thức thanh toán</span>
        </div>
        <button className={styles.paymentMethod}>
          Thanh toán khi nhận hàng
        </button>
      </section>

      {/* Chi tiết thanh toán */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <CreditCardOutlined className={styles.headerIcon} />
          <h2>Chi tiết thanh toán</h2>
        </div>
        <div className={styles.priceRow}>
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className={styles.priceRow}>
          <span>Phí vận chuyển</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Tổng thanh toán</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.terms}>
          <SafetyOutlined className={styles.termsIcon} />
          Nhấn "Đặt hàng" đồng nghĩa vi việc bạn đồng ý tuân theo
          <a href="https://help.shopee.vn/portal/article/77242">
            Điều khoản Shopee
          </a>
        </div>
        <Button
          type="primary"
          className={styles.orderButton}
          onClick={handleOrderSubmit}
          loading={isLoading}
        >
          Đặt hàng
        </Button>
      </footer>
    </div>
  );
};

export default Checkout;
