import {
  Row,
  Col,
  Rate,
  Button,
  InputNumber,
  Card,
  Typography,
  Tag,
  Divider,
  Form,
  Modal,
  Skeleton,
} from "antd";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import styles from "./ViewDetails.module.css";
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import BookDetailsSkeleton from "./BookDetailsSkeleton";
import { useDispatch } from "react-redux";
import { addToCart, buyNow } from "../../redux/order/orderSlice";

const { Title, Text } = Typography;

const ViewDetails = (props) => {
  const { book } = props;
  const [form] = Form.useForm();
  const maxQuantity = book?.quantity || 0;
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  // Format price to VND
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Use useEffect to handle gallery images
  useEffect(() => {
    if (!book) {
      setGalleryImages([]);
      return;
    }

    // Create base URL for images
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/images/book/`;

    // Combine thumbnail and slider images
    const allImages = [book.thumbnail, ...(book.slider || [])];

    // Format for react-image-gallery
    const formattedImages = allImages.map((image) => ({
      original: `${baseURL}${image}`,
      thumbnail: `${baseURL}${image}`,
      originalHeight: "380vh",
    }));

    setGalleryImages(formattedImages);
  }, [book]); // Only re-run when book changes

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const visibleThumbnails = 4;

  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle navigation - only moves thumbnail window
  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else {
      // Cycle to the end
      setStartIndex(galleryImages.length - visibleThumbnails);
    }
  };

  const handleNext = () => {
    if (startIndex < galleryImages.length - visibleThumbnails) {
      setStartIndex(startIndex + 1);
    } else {
      // Cycle to the start
      setStartIndex(0);
    }
  };

  // Handle hover
  const handleThumbnailHover = (index) => {
    setHoveredIndex(index);
    setCurrentImageIndex(index);
  };

  const handleThumbnailLeave = () => {
    setHoveredIndex(null);
  };

  // Handle direct input change
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Allow empty input for deletion
    if (value === "") {
      setQuantity("");
      return;
    }

    // Convert to number and validate
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setQuantity(numValue);
    }
  };

  // Handle blur to enforce min/max constraints
  const handleBlur = () => {
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    } else if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  };

  // Handle increment/decrement
  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, Number(prev) - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxQuantity, Number(prev) + 1));
  };

  // Add modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Add these handlers
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        quantity,
        _id: book?._id,
        detail: book,
      })
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    dispatch(
      buyNow({
        quantity,
        _id: book?._id,
        detail: book,
      })
    );
  };

  // Add this effect to simulate loading
  useEffect(() => {
    if (book) {
      // Give a small delay to prevent flash
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [book]);

  return (
    <Form form={form} initialValues={{ quantity: 1 }}>
      <Card className={styles.productCard}>
        {loading ? (
          <BookDetailsSkeleton />
        ) : (
          <Row
            gutter={[
              { xs: 8, sm: 16, md: 24 },
              { xs: 8, sm: 16, md: 24 },
            ]}
          >
            <Col xs={24} sm={24} md={12}>
              <div className={styles.imageSection}>
                {/* Main Image Container */}
                <div
                  className={styles.mainImageContainer}
                  onClick={showModal}
                  style={{ cursor: "pointer" }}
                >
                  {galleryImages.length > 0 && (
                    <img
                      src={
                        galleryImages[
                          hoveredIndex !== null
                            ? hoveredIndex
                            : currentImageIndex
                        ].original
                      }
                      alt={book?.mainText}
                      className={styles.mainImage}
                    />
                  )}
                </div>

                {/* Thumbnails Container */}
                {galleryImages.length > 1 && (
                  <div className={styles.thumbnailSection}>
                    <div className={styles.thumbnailWrapper}>
                      <Button
                        type="default"
                        icon={<LeftOutlined />}
                        className={`${styles.thumbnailNav} ${styles.thumbnailNavLeft}`}
                        onClick={handlePrevious}
                        disabled={galleryImages.length <= visibleThumbnails}
                      />
                      <div className={styles.thumbnailScrollContainer}>
                        <Row
                          className={styles.thumbnailContainer}
                          gutter={[4, 4]}
                        >
                          {galleryImages
                            .slice(startIndex, startIndex + visibleThumbnails)
                            .map((image, idx) => {
                              const actualIndex = startIndex + idx;
                              return (
                                <Col span={6} key={actualIndex}>
                                  <div
                                    className={`${styles.thumbnailItem} ${
                                      hoveredIndex === actualIndex
                                        ? styles.hoveredThumbnail
                                        : ""
                                    }`}
                                    onMouseEnter={() =>
                                      handleThumbnailHover(actualIndex)
                                    }
                                    onMouseLeave={handleThumbnailLeave}
                                  >
                                    <img
                                      src={image.thumbnail}
                                      alt={`${book?.mainText} - Image ${
                                        actualIndex + 1
                                      }`}
                                      className={styles.thumbnail}
                                    />
                                  </div>
                                </Col>
                              );
                            })}
                        </Row>
                      </div>
                      <Button
                        type="default"
                        icon={<RightOutlined />}
                        className={`${styles.thumbnailNav} ${styles.thumbnailNavRight}`}
                        onClick={handleNext}
                        disabled={galleryImages.length <= visibleThumbnails}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Col>

            {/* Right side - Product Details */}
            <Col xs={24} sm={24} md={12}>
              <div className={styles.productInfo}>
                <div className={styles.tagContainer}>
                  <Tag color="pink" className={styles.favoriteTag}>
                    Yêu thích
                  </Tag>
                  <Tag
                    color="blue"
                    className={styles.authorTag}
                    icon={<i className="fas fa-pen-fancy" />}
                  >
                    Tác giả: {book?.author || "Unknown"}
                  </Tag>
                </div>

                <Title level={3} className={styles.productTitle}>
                  {book?.mainText}
                </Title>

                <div className={styles.ratingSection}>
                  <Rate disabled defaultValue={5} />
                  <Text className={styles.ratingText}>
                    5.0 ({book?.sold || 0} đã bán)
                  </Text>
                </div>

                <div className={styles.priceSection}>
                  <Title level={2} type="danger">
                    {formatToVND(book?.price)}
                  </Title>
                </div>

                {/* Return Policy Section */}
                <div className={styles.policySection}>
                  <Title level={5}>Chính sách Trả hàng</Title>
                  <div className={styles.policyContent}>
                    <div className={styles.policyItem}>
                      <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/b69402e4275f823f7d47.svg"
                        alt="return policy"
                      />
                      <Text strong>Trả hàng 15 ngày</Text>
                    </div>
                    <Divider type="vertical" className={styles.policyDivider} />
                    <div className={styles.policyItem}>
                      <CheckCircleOutlined className={styles.policyIcon} />
                      <Text type="secondary">Trả hàng miễn phí</Text>
                    </div>
                  </div>
                </div>

                {/* Shipping Section */}
                <div className={styles.shippingSection}>
                  <Title level={5}>Vận chuyển</Title>
                  <div className={styles.shippingContent}>
                    <div className={styles.shippingItem}>
                      <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/3e0adc366a3964f4fb59.svg"
                        alt="shopee"
                        className={styles.shippingIcon}
                      />
                      <Text>Xử lý đơn hàng bởi BookAAA</Text>
                    </div>
                    <Divider
                      type="vertical"
                      className={styles.shippingDivider}
                    />
                    <div className={styles.shippingItem}>
                      <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/d9e992985b18d96aab90.png"
                        alt="free shipping"
                        className={styles.shippingIcon}
                      />
                      <Text>Miễn phí vận chuyển</Text>
                    </div>
                  </div>
                </div>

                {/* Quantity Section */}
                <div className={styles.quantitySection}>
                  <Title level={5}>Số lượng</Title>
                  <div className={styles.quantityContent}>
                    <div className={styles.quantitySelector}>
                      <button
                        type="button"
                        aria-label="Decrease"
                        className={styles.quantityButton}
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                      >
                        <svg
                          viewBox="0 0 10 10"
                          className={styles.quantityIcon}
                        >
                          <polygon points="4.5 4.5 3.5 4.5 0 4.5 0 5.5 3.5 5.5 4.5 5.5 10 5.5 10 4.5" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.quantityInput}
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        aria-label="Increase"
                        className={styles.quantityButton}
                        onClick={handleIncrease}
                        disabled={quantity >= maxQuantity}
                      >
                        <svg
                          viewBox="0 0 10 10"
                          className={styles.quantityIcon}
                        >
                          <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5" />
                        </svg>
                      </button>
                    </div>
                    <Text type="secondary" style={{ color: "#757575" }}>
                      {book?.quantity || 0} sản phẩm có sẵn
                    </Text>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <Button
                    type="default"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className={styles.cartButton}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    className={styles.buyButton}
                    onClick={handleAddToCart}
                  >
                    Mua ngay
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Card>

      {showToast && (
        <div className={styles.toast__container}>
          <div className={styles.toast__icon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.55 18.2L3.65 12.3L5.075 10.875L9.55 15.35L18.925 5.975L20.35 7.4L9.55 18.2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className={styles.toast__text} role="alert">
            Sản phẩm đã được thêm vào Giỏ hàng
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width="90vw"
        className={styles.imageViewerModal}
        closable
        centered
      >
        <div className={styles.modalContent}>
          <div className={styles.galleryContainer}>
            <ImageGallery
              items={galleryImages}
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={true}
              thumbnailPosition="bottom"
              useBrowserFullscreen={true}
              showIndex={true}
              onSlide={(currentIndex) => setCurrentImageIndex(currentIndex)}
              startIndex={currentImageIndex}
              slideDuration={300}
              lazyLoad={true}
              thumbnailHeight={90}
              thumbnailWidth={90}
              slideInterval={3000}
              renderThumbInner={(item) => (
                <div className="image-gallery-thumbnail-inner">
                  <img
                    src={item.thumbnail}
                    alt={item.description}
                    className="image-gallery-thumbnail-image"
                  />
                </div>
              )}
              // onSlide={(currentIndex) => {
              //   setCurrentImageIndex(currentIndex);
              //   // Optional: Add any additional logic when sliding
              // }}
            />
          </div>
          <div className={styles.modalTitle}>
            <h3>{book?.mainText}</h3>
          </div>
        </div>
      </Modal>
    </Form>
  );
};

export default ViewDetails;
