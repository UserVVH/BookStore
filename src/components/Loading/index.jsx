import { GridLoader } from "react-spinners";

const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <GridLoader color="#123abc" size={30} />
  </div>
);

export default Loading;
