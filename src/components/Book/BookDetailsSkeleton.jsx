import { Row, Col, Skeleton } from "antd";
import styles from "./ViewDetails.module.css";

const BookDetailsSkeleton = () => {
  return (
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
            style={{
              width: "100%",
              paddingTop: "80%",
              position: "relative",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Skeleton.Image
              active={true}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                height: "90%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Thumbnails Container */}
          <div className={styles.thumbnailSection}>
            <div className={styles.thumbnailWrapper}>
              <Row gutter={[4, 4]} style={{ marginTop: "16px" }}>
                {[...Array(4)].map((_, index) => (
                  <Col span={6} key={index}>
                    <div
                      style={{
                        width: "100%",
                        paddingTop: "100%",
                        position: "relative",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <Skeleton.Image
                        active={true}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "85%",
                          height: "85%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </Col>

      {/* Product Details Skeleton */}
      <Col xs={24} sm={24} md={12}>
        <div className={styles.productInfo}>
          <div className={styles.tagContainer}>
            <Skeleton.Button
              active={true}
              size="small"
              style={{ width: "80px", marginRight: "8px" }}
            />
            <Skeleton.Button
              active={true}
              size="small"
              style={{ width: "150px" }}
            />
          </div>

          <Skeleton
            active={true}
            paragraph={false}
            title={{
              width: "85%",
              style: { marginTop: "16px", height: "30px" },
            }}
          />

          <div style={{ marginTop: "16px" }}>
            <Skeleton.Input
              active={true}
              size="small"
              style={{ width: "200px" }}
            />
          </div>

          <div style={{ marginTop: "24px" }}>
            <Skeleton.Input
              active={true}
              size="large"
              style={{ width: "180px", height: "40px" }}
            />
          </div>

          {/* Policy and Shipping Sections */}
          {[...Array(2)].map((_, index) => (
            <div style={{ marginTop: "24px" }} key={index}>
              <Skeleton
                active={true}
                paragraph={{ rows: 2, width: ["40%", "60%"] }}
                title={{ width: "120px" }}
              />
            </div>
          ))}

          {/* Quantity Section */}
          <div style={{ marginTop: "24px" }}>
            <Skeleton.Input
              active={true}
              size="small"
              style={{ width: "120px", marginBottom: "8px" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Skeleton.Button
                active={true}
                size="small"
                style={{ width: "32px", height: "32px" }}
              />
              <Skeleton.Input
                active={true}
                size="small"
                style={{ width: "60px" }}
              />
              <Skeleton.Button
                active={true}
                size="small"
                style={{ width: "32px", height: "32px" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons} style={{ marginTop: "24px" }}>
            <Skeleton.Button
              active={true}
              size="large"
              style={{ width: "180px", height: "40px", marginRight: "16px" }}
            />
            <Skeleton.Button
              active={true}
              size="large"
              style={{ width: "180px", height: "40px" }}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default BookDetailsSkeleton;
