import styles from "./Modal.module.css";
import ReactDOM from "react-dom";
import { Fragment } from "react";

const Backdrop = (props) => {
  return <div className={styles.backdrop}></div>;
};

const ModalOverlay = (props) => {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <>
          <Backdrop />
          <ModalOverlay>{props.children}</ModalOverlay>
        </>,
        document.getElementById("overlays")
      )}
    </Fragment>
  );
};
export default Modal;
