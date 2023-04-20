import styles from "./Overlay.module.css";

import Card from "../UI/Card/Card";
import Buttons from "../UI/Buttons/Buttons";

const Overlay = (props) => {
  if (!props.display) return;
  const cancelHandler = (e) => {
    if (e.target.className !== styles["overlay-container"]) return;

    props.toggleOverlay();
  };
  return (
    <div className={styles["overlay-container"]} onClick={cancelHandler}>
      <Card>
        <h2>Invalid input</h2>
        <p>{props.message}</p>
        <Buttons className={"small"} okay={props.toggleOverlay} type={"button"}>
          Okay
        </Buttons>
      </Card>
    </div>
  );
};

export default Overlay;
