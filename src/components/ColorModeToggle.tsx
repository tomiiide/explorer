import React from "react";
import { ColorModeContext } from "@/contexts/ColorMode";
import IconButton from "@mui/material/IconButton";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { useTheme } from "@mui/material";
import styles from "@/styles/components/ColorModeToggle.module.css";

const ColorModeToggle = () => {
  const theme = useTheme();
  const { toggleColorMode } = React.useContext(ColorModeContext);
  return (
    <IconButton onClick={toggleColorMode}>
      {theme.palette.mode === "light" ? (
        <DarkModeRoundedIcon  className={styles.toggleIcon} />
      ) : (
        <LightModeRoundedIcon className={styles.toggleIcon} />
      )}
    </IconButton>
  );
};

export default ColorModeToggle;
