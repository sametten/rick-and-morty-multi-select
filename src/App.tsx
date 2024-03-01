import Select from "./Select/index";
import styles from './style.module.css';

import RickAndMortyLogo from "../public/r&m.png";

const App = () => {
  return (
    <>
        <div className={styles['select-container']}>
            <img className={styles['select-container__logo']} src={RickAndMortyLogo}/>
            <div className={styles['select-container__select']}>
                <Select />
            </div>
            <div className={styles['select-container__short-cuts']}>
                <div className={styles['short-cuts__items']}>
                    <span><i>↑</i></span>
                    <span><i>↓</i></span>
                    <p>Navigate options</p>
                </div>
                <div className={styles['short-cuts__items']}>
                    <span>
                        <i>↵</i>
                    </span>
                    <p>Select / unselect</p>
                </div>
                <div className={styles['short-cuts__items']}>
                    <span>
                        <i>⌫</i>
                    </span>
                    <p>Remove</p>
                </div>
                <div className={styles['short-cuts__items']}>
                    <span>
                        <i>Esc</i>
                    </span>
                    <p>Close options</p>
                </div>
            </div>
        </div>
        
    </>
  )
}

export default App
