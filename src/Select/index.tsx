import { createRef, useEffect, useState } from 'react';
import { useKey } from 'react-use';

import Selected from './Selected'
import Input from './Input';
import Result from './Result';

import type { Character }  from "./SelectTypes";
import styles from "./style.module.css";

const Select = () => {
    /* Main */
    const selectRef = createRef<HTMLDivElement>();

    const selectClick = () => {
        inputFocus();
        openResults();
    }

    useEffect(() => {
        const documentClick = (e: MouseEvent) => {
            if (e && selectRef.current && !selectRef.current.contains(e?.target as Node)) 
                closeResults()
        }

        document.addEventListener("mousedown", (e) => documentClick(e));
        return () => document.removeEventListener("mousedown", (e) => documentClick(e));
    }, [selectRef])


    /* Input Handlings */
    const inputRef = createRef<HTMLInputElement>();
    const [inputActive, setInputActive] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");

    const inputFocus = () => {
        inputRef.current?.focus()
        setInputActive(true);
    }
    const inputBlur = () => {
        (document?.activeElement as HTMLElement).blur(); 
        setInputActive(false);
    }

    const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        setResultActive(undefined);
    };

    /* Selected Character Handlings */
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
    
    const selectedItemOnDelete = (char: Character) => removeSelectedChar(char);
    const removeSelectedChar = (char: Character) => setSelectedCharacters(selectedCharacters.filter(item => item.id !== char.id))
    const addSelectedChar = (char: Character) => setSelectedCharacters(selectedCharacters => [...selectedCharacters, char])
    const removeLastSelectedChar = () => {
        setSelectedCharacters(selectedCharacters => selectedCharacters.slice(0, -1))
    }

    /* Result Handlings */
    const resultsWrapperRef = createRef<HTMLDivElement>();

    const [results, setResults] = useState<Character[]>([]);
    const [resultsOpened, setResultsOpened] = useState<boolean>(false);
    const [resultActive, setResultActive] = useState<Character>();

    const resetResults = () => setResults([]);
    const openResults = () => setResultsOpened(true);
    const closeResults = () => setResultsOpened(false);
    const showResultWrapper = () => (results.length && resultsOpened ? true : false);

    const resultOnToggle = (char: Character) => {
        if(selectedCharacters.indexOf(char) === -1) {
            addSelectedChar(char);
        } else {
            removeSelectedChar(char);
        }
    }

    const resultOnActive = (char: Character) => setResultActive(char);
    const resultIsActive = (char: Character) => (resultActive?.id === char.id);

    const resultIsSelected = (char: Character) => {
        return selectedCharacters.find((selectedCharacters) => selectedCharacters.id === char.id) ? true : false;
    }

    const selectActiveResult = (direction: "up" | "down") => {
        let newIndex = 0;
        const resultActiveIndex = resultActive ? results.indexOf(resultActive) : -1;

        if(resultActiveIndex === -1) {
            newIndex = direction === "up" ? results.length - 1 : 0;
        } else {
            if(direction === "up") {
                newIndex = resultActiveIndex === 0 ? results.length - 1 : resultActiveIndex - 1;
            } else {
                newIndex = resultActiveIndex + 1 === results.length ? 0 : resultActiveIndex + 1;
            }
        }

        setResultActive(results[newIndex])
        arrrowScroll(newIndex);
    }

    useEffect(() => {
        if(inputValue.length) {
            fetch(`https://rickandmortyapi.com/api/character/?name=${inputValue}`)
            .then(response => response.json())
            .then(data => {
                if(data.results && data.results.length) {   
                    resetResults();

                    data.results.map((r: any) => {
                        setResults(results => [...results, {
                            name: r.name,
                            episode: r.episode.length,
                            image: r.image,
                            id: r.id,
                        }])
                    })
                } else {
                    resetResults();
                }
            })
            .catch(() => resetResults());
        } else {
            resetResults();
        }
    }, [inputValue])

    
    const arrrowScroll = (newIndex: number) => {
            (resultsWrapperRef.current?.childNodes[newIndex] as HTMLElement)
                .scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }


    /* No Result Handlings */
    const showNoResultWrapper = () => (!results.length && inputValue.length && resultsOpened ? true : false)

    /* Key Controls */
    useKey('Escape', () => {
        if(inputActive) {
            closeResults();
            inputBlur();
        }
    }, {}, [inputActive]);

    useKey('Backspace', () => {
        if(inputActive && !inputValue && selectedCharacters.length) {
            removeLastSelectedChar();
        }
            
    }, {}, [inputActive, inputValue, selectedCharacters]);

    useKey('ArrowDown', () => {
        if(inputActive) {
            selectActiveResult("down");
        }
    }, {}, [inputActive, results, resultActive, resultsWrapperRef]);

    useKey('ArrowUp', () => {
        if(inputActive) {
            selectActiveResult("up");
        }
    }, {}, [inputActive, results, resultActive, resultsWrapperRef]);

    useKey('Enter', () => {
        if(inputActive && resultActive) {
            resultOnToggle(resultActive);
        }
    }, {}, [inputActive, results, resultActive, selectedCharacters]);

    /* */
    return (
        <>
            <div ref={selectRef} className={styles['select']} onClick={selectClick}>

                {/* Selected Input */}
                <div className={styles['select__input']}>
                    {selectedCharacters.map((char, i) => {
                        return <Selected 
                            key={i} 
                            char={char} 
                            onDelete={selectedItemOnDelete}
                        />
                    })}
                    <Input inputRef={inputRef} result={selectedCharacters.length} onChange={inputOnChange}/>
                </div>

                {/* Result */}
                {showResultWrapper() &&
                    <div ref={resultsWrapperRef} className={styles['select__result']}>
                        {results.map((char, i) => {
                            return <Result 
                                key={i} 
                                selected={resultIsSelected(char)} 
                                active={resultIsActive(char)} 
                                char={char} 
                                highlight={inputValue} 
                                onToggle={resultOnToggle} 
                                onActive={resultOnActive}
                            />
                        })}
                    </div>
                }

                {/* No Result */}
                {showNoResultWrapper() &&
                    <div className={styles['select__no-result']}>
                        <p>No result found.</p>
                    </div>
                }
            </div>
        </>
  )
}

export default Select
