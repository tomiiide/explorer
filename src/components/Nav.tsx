import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/components/Nav.module.css";
import SearchInput from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ColorModeToggle from "./ColorModeToggle";
import { Link, Typography, useTheme } from "@mui/material";

const Nav = ({
  handleSearch,
  currentSearch,
}: {
  handleSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentSearch?: string;
}) => {
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (handleSearch) {
      handleSearch(event);
    }
  };
  const theme = useTheme();
  return (
    <nav className={styles.nav}>
      <Link href="https://app.hop.exchange" className={styles.backToHop}>
        <ArrowBackRoundedIcon fontSize="small" />
        <Typography sx={{ fontWeight: "light", fontSize: ".8rem" }}>
          back to Hop.Exchange
        </Typography>
      </Link>

      <div className={styles.navWrapper}>
        <Image
          src={theme.palette.mode === "dark" ? "/logo.svg" : "/logo-dark.svg"}
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
            onChange={handleSearchInput}
            value={currentSearch}
            fullWidth
          />
        </div>
        <div className={styles.toggle}>
          <ColorModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
