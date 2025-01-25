import { Button } from "@mui/material";

export const CustomButton = ({
  label,
  onClick,
  variant = "contained",
  color = "primary",
  startIcon = null,
  endIcon = null,
  style = {},
  disabled = false,
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      style={{ ...style }}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};
