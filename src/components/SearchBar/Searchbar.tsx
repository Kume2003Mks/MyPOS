import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.scss';

interface InputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

const SearchBar: React.FC<InputProps> = ({ value, onChange, placeholder = '', type = 'text' }) => {
    return (
        <div className={styles.searchBar}>
            <FaSearch className={styles.icon} />
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.input} />
        </div>
    );
};

export default SearchBar;
