import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { FilterOutlined, UndoOutlined } from "@ant-design/icons";
import {
  InputNumber,
  Button,
  Select,
  Pagination,
  Card,
  Row,
  Col,
  Grid,
  Form,
  Checkbox,
  Tooltip,
  Spin,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { getCategory, getFilteredBooks } from "../../service/book-service";
import { useNavigate } from "react-router-dom";
import convertToSlug from "../../utils/string-utils";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchTerm } from "../../redux/search/searchSlice";

const { useBreakpoint } = Grid;

// Add this function near the top of your component or as a utility function
const formatVND = (value) => {
  if (!value) return "";
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Home = () => {
  const [form] = Form.useForm();
  const [filterRating, setFilterRating] = useState(null);
  const [sortOption, setSortOption] = useState("popular");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [categories, setCategories] = useState([]);
  const screens = useBreakpoint();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [sortField, setSortField] = useState("-sold");
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const navigate = useNavigate();
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const dispatch = useDispatch();

  const handleBookClick = (book) => {
    const slug = convertToSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };

  const handleGetCategories = async () => {
    const res = await getCategory();
    if (res.data) {
      setCategories(res.data);
    }
  };

  const priceOptions = [
    {
      value: "price_asc",
      label: "Giá: Thấp đến Cao",
      icon: <ArrowUpOutlined style={{ marginRight: "6px" }} />,
    },
    {
      value: "price_desc",
      label: "Giá: Cao đến Thấp",
      icon: <ArrowDownOutlined style={{ marginRight: "6px" }} />,
    },
  ];

  const handleRatingFilter = (rating) => {
    setFilterRating(rating === filterRating ? null : rating);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    form.resetFields();
    setFilterRating(null);
    setSelectedCategories([]);
    setPriceRange({ min: null, max: null });
    dispatch(clearSearchTerm());
    navigate("/", { replace: true });
  };

  const handleSortChange = (value) => {
    let newSortField = "-sold";

    switch (value) {
      case "newest":
        newSortField = "-updatedAt";
        break;
      case "price_asc":
        newSortField = "price";
        break;
      case "price_desc":
        newSortField = "-price";
        break;
      case "bestseller":
        newSortField = "-sold";
        break;
      default:
        newSortField = "-sold";
    }

    setSortField(newSortField);
    setSortOption(value);
    if (value.includes("price_")) {
      setSelectedPrice(value);
    } else {
      setSelectedPrice(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // You can calculate the items to display here:
    // const startIndex = (page - 1) * pageSize;
    // const endIndex = startIndex + pageSize;
    // Add your page navigation logic here
    // console.log(`Displaying items from ${startIndex} to ${endIndex}`);
  };

  const PriceSelect = () => (
    <Select
      placeholder="Giá"
      style={{
        width: screens.xs ? "100%" : 180,
      }}
      onChange={(value) => handleSortChange(value)}
      value={selectedPrice}
      popupClassName={styles.priceSelectDropdown}
      dropdownStyle={{ padding: "8px 0" }}
      className={styles.blackPlaceholder}
    >
      {priceOptions.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          <div className={styles.priceOption}>
            {option.icon}
            <span>{option.label}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const filterParams = {
        categories: selectedCategories,
        ...(priceRange?.min !== null && { minPrice: priceRange.min }),
        ...(priceRange?.max !== null && { maxPrice: priceRange.max }),
        sortField: sortField,
        ...(searchTerm && { mainText: searchTerm }),
        // TODO: Uncomment when backend supports rating filter
        // ...(filterRating && { rating: filterRating }),
      };

      const res = await getFilteredBooks(currentPage, pageSize, filterParams);

      if (res?.data) {
        setData(res.data.result);
        setTotalData(res.data.meta.total);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [
    currentPage,
    pageSize,
    selectedCategories,
    sortField,
    priceRange,
    searchTerm,
  ]);

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
    setCurrentPage(1); // Reset to first page when changing categories
  };

  const handleApplyFilters = (values) => {
    const { priceRange } = values;
    setPriceRange({
      min: priceRange?.min ? Number(priceRange.min) : null,
      max: priceRange?.max ? Number(priceRange.max) : null,
    });
  };

  useEffect(() => {
    handleGetCategories();
  }, []);

  return (
    <Row className={styles.container}>
      <Col xs={24} sm={24} md={6} lg={5} xl={4} className={styles.filterPanel}>
        <div className={styles.filterHeader}>
          <div className={styles.filterHeaderLeft}>
            <FilterOutlined className={styles.filterIcon} />
            <span className={styles.filterTitle}>BỘ LỌC TÌM KIẾM</span>
          </div>
          <UndoOutlined
            className={styles.resetIcon}
            onClick={handleResetFilters}
          />
        </div>

        <Form form={form} onFinish={handleApplyFilters} layout="vertical">
          <div className={styles.filterGroup}>
            <h3 className={styles.filterGroupHeader}>Theo Danh Mục</h3>
            <Form.Item name="categories">
              <Checkbox.Group
                className={styles.categoryCheckboxGroup}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <div key={category} className={styles.categoryOption}>
                    <Checkbox value={category}>{category}</Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterGroupHeader}>Khoảng Giá</h3>
            <div className={styles.priceRangeInputs}>
              <Form.Item
                name={["priceRange", "min"]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  className={styles.priceInput}
                  placeholder="₫ TỪ"
                  formatter={formatVND}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  controls={false}
                  maxLength={13}
                />
              </Form.Item>
              <div className={styles.rangeLine}></div>
              <Form.Item
                name={["priceRange", "max"]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  className={styles.priceInput}
                  placeholder="₫ ĐẾN"
                  formatter={formatVND}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  controls={false}
                  maxLength={13}
                />
              </Form.Item>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.applyButton}
            >
              Áp dụng
            </Button>
          </div>
        </Form>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterGroupHeader}>Đánh Giá</h3>
          <div className={styles.filterOptions}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className={`${styles.filterOption} ${
                  filterRating === rating ? styles.selected : ""
                }`}
                onClick={() => handleRatingFilter(rating)}
              >
                <div className={styles.ratingStars}>
                  {[...Array(rating)].map((_, index) => (
                    <span key={index} className={styles.star}>
                      ★
                    </span>
                  ))}
                  {[...Array(5 - rating)].map((_, index) => (
                    <span key={index} className={styles.starEmpty}>
                      ★
                    </span>
                  ))}
                </div>
                <span className={styles.filterLabel}>trở lên</span>
              </div>
            ))}
          </div>
        </div>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={18}
        lg={19}
        xl={20}
        className={styles.mainContent}
      >
        <Row className={styles.sortBar} justify="space-between" align="middle">
          <Col xs={24} sm={24} md={16} lg={18}>
            <div className={styles.sortBarLeft}>
              <span className={styles.sortLabel}>Sắp xếp theo</span>
              <div className={styles.sortOptions}>
                <Button
                  size={screens.xs ? "small" : "middle"}
                  type={sortOption === "popular" ? "primary" : "default"}
                  onClick={() => handleSortChange("popular")}
                >
                  Phổ biến
                </Button>
                <Button
                  size={screens.xs ? "small" : "middle"}
                  type={sortOption === "newest" ? "primary" : "default"}
                  onClick={() => handleSortChange("newest")}
                >
                  Mới nhất
                </Button>
                <Button
                  size={screens.xs ? "small" : "middle"}
                  type={sortOption === "bestseller" ? "primary" : "default"}
                  onClick={() => handleSortChange("bestseller")}
                >
                  Bán chạy
                </Button>
                <PriceSelect />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={6}>
            <div className={styles.paginationWrapper}>
              <Pagination
                simple
                current={currentPage}
                total={totalData}
                pageSize={pageSize}
                onChange={handlePageChange}
                size="small"
                className={styles.pagination}
                showSizeChanger={false}
              />
            </div>
          </Col>
        </Row>

        {/* Product Grid */}
        <div className={styles.productGridWrapper}>
          <Spin spinning={loading} tip="Loading...">
            <div className={styles.productGrid}>
              {data.map((book) => (
                <div key={book._id} className={styles.productItem}>
                  <Card
                    hoverable
                    onClick={() => handleBookClick(book)}
                    cover={
                      <div className={styles.productImageWrapper}>
                        <img
                          alt={book.mainText}
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${book.thumbnail}`}
                          className={styles.productImage}
                          loading="lazy"
                        />
                      </div>
                    }
                    className={styles.productCard}
                    bodyStyle={{ padding: "8px" }}
                  >
                    <div className={styles.productInfo}>
                      <Tooltip
                        title={book.mainText}
                        placement="topLeft"
                        overlayStyle={{ maxWidth: "300px" }}
                      >
                        <div className={styles.productName}>
                          {book.mainText}
                        </div>
                      </Tooltip>
                      <div className={styles.productPrice}>
                        <span className={styles.currencySymbol}>₫</span>
                        {book.price.toLocaleString()}
                      </div>
                      <div className={styles.productFooter}>
                        <div className={styles.productStats}>
                          <div className={styles.ratingContainer}>
                            <span
                              style={{ color: "#ffce3d", fontSize: "19px" }}
                            >
                              ★
                            </span>
                            <span className={styles.ratingNumber}>5</span>
                          </div>
                          <div className={styles.statsDelimiter}>|</div>
                          <div className={styles.soldCount}>
                            Đã bán {book.sold}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Spin>
        </div>

        <div className={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalData}
            onChange={handlePageChange}
            showSizeChanger={false}
            className={styles.customPagination}
            size="large"
          />
        </div>
      </Col>
    </Row>
  );
};

export default Home;
