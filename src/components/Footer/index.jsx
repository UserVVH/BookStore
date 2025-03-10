import styles from "./Footer.module.css";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p className={styles.footerText}>
          Chào mừng đến với BookAAA - nơi mỗi cuốn sách không chỉ là một câu
          chuyện, mà còn là một trải nghiệm tuyệt vời đang chờ bạn khám phá!
        </p>
      </div>
    </footer>
  );
};
export default Footer;
