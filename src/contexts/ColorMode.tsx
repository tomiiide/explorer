import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  children: React.ReactNode;
}

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default function ToggleColorMode({ children }: Props) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const defaultMode = prefersDarkMode ? "dark" : "light";
  const [mode, setMode] = React.useState<"light" | "dark">(defaultMode);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
            fontFamily: [
                '"Nunito"',
                '-apple-system',
                'BlinkMacSystemFont',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
              ].join(','),
        }
      }),
    [mode]
  );

  React.useEffect(() => {
      setMode(defaultMode);
  }, [defaultMode]);

  React.useEffect(() => {
    if (document) {
      const body = document.querySelector("body");
      if (body) {
        body.dataset.theme = mode;
      }
    }
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
