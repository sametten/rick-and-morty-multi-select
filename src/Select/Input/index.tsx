import styles from './style.module.css';

import { useState, useEffect, createRef } from 'react';

/* Props */
interface Props {
    inputRef: React.RefObject<HTMLInputElement>;
    result: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = (props: Props) => {
    
    /* Input Value Update */
    const [inputValue, setInputValue] = useState<string>("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        props.onChange(e);
    };

    /* Input Width Update  */
    const fakeRef = createRef<HTMLDivElement>()
    const [inputWidth, setInputWidth] = useState<number>(0);

    useEffect(() => {
        setInputWidth(inputValue.length ? (fakeRef.current?.getBoundingClientRect().width || 0) + 16 || 0 : 0)
    }, [inputValue, fakeRef]);

    /* Input Style Update  */
    const [inputStyle, setInputStyle] = useState<{ width: string } | undefined>(undefined);

    useEffect(() => {
        setInputStyle(inputWidth ? {width: `${inputWidth}px`}: undefined)
    }, [inputWidth])

    /* Get ClassName */
    const getClassName = () => {
        return props.result === 0 && !inputValue ? 
            `${styles["select-input"]} ${styles["select-input--empty"]}` : styles["select-input"];
    }

    /* */
    return (
        <>
            <div className={getClassName()}>
                <div ref={fakeRef} className={styles["select-input__fake"]}>{inputValue}</div>
                <input
                    placeholder="Start typing.."
                    style={inputStyle}
                    className={styles["select-input__input"]}
                    ref={props.inputRef}
                    value={inputValue} 
                    onChange={onChange}
                />
            </div>
        </>
    )
  }
  
  export default Input