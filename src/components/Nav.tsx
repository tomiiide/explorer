import Image from "next/image";
import styles from "@/styles/components/Nav.module.css";
import SearchInput from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ColorModeToggle from "./ColorModeToggle";
import { useTheme } from "@mui/material";

const Nav = () => {
const theme = useTheme();
  return (
    <nav className={styles.nav}>
      <Image
        src={ theme.palette.mode === 'dark' ? "/logo.svg" : "/logo-dark.svg"}
        alt="Hop Exchange Explorer Logo"
        height={32}
        width={180}
      />
      <div className={styles.search}>
      <SearchInput
        placeholder="Search by bonder / address / txId"
        startAdornment={
          <InputAdornment position="start">
            <SearchRoundedIcon />
          </InputAdornment>
        }
        fullWidth
      />
      </div>
      <div className={styles.toggle}>
        <ColorModeToggle />
      </div>
    </nav>
  );
};

export default Nav;
