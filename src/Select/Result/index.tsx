import Highlighter from "react-highlight-words";

import styles from './style.module.css';
import SelectedSvg from "@/assets/selected.svg?react";

import type { Character }  from "./types";

interface Props {
    char: Character
    selected: boolean;
    active: boolean;
    highlight: string;
    onToggle: (char: Character) => void;
    onActive: (char: Character) => void;
}

const Result = (props: Props) => {

    /* Result Click */
    const onClick = () => {
        props.onToggle(props.char);
    }

    /* Get ClassName */
    const getClassName = () => {
        return `${styles["result-item__body"]} ${props.selected ? styles["result-item__body--selected"] : ""} ${props.active ? styles["result-item__body--active"] : ""}`;
    }

    /* Active Item Control */
    const onMouseEnter = () => props.onActive(props.char);

    /* */
    return (
        <>
            <a onClick={onClick} onMouseEnter={onMouseEnter} className={getClassName()}>
                <div className={styles["body__selected"]}>
                    <SelectedSvg/>
                </div>
                <img src={props.char.image} className={styles["body__image"]} />
                <div className={styles["body__info"]}>
                    <h6><Highlighter textToHighlight={props.char.name} autoEscape={true} searchWords={[props.char.highlight]}/></h6>
                    <p>{`${props.char.episode} Episode`}</p>
                </div>
            </a>
        </>
    )
}

export default Result;