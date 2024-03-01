import styles from './style.module.css';
import Close from "@/assets/close.svg?react";

import type { Character }  from "./types";

interface Props {
  char: Character,
  onDelete: (char: Character) => void;
}

const Selecetd = (props: Props) => {

    /* Selected Click */
    const onClick = () => {
        props.onDelete(props.char);
    }

    /* */
    return (
      <>
        <div className={styles["select__selected"]}>
          {props.char.name}
          <a onClick={onClick}>
            <Close />
          </a>
        </div>
        
      </>
    )
  }
  
  export default Selecetd;
  