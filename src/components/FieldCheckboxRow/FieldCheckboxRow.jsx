import { Checkbox } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import FootballIcon from "@/components/FootballIcon";
import { styled } from "@pigment-css/react";

function FieldCheckboxRow({ key, checked, onChange, children, ...props }) {
  return (
    <FieldRow key={key}>
      <StyledCheckbox checked={checked} onChange={onChange} {...props}>
        <CheckboxIconContainer>
          <FootballIcon />
        </CheckboxIconContainer>
      </StyledCheckbox>
      <FieldLabel>{children}</FieldLabel>
    </FieldRow>
  );
}

export default FieldCheckboxRow;

// TODO: Abstract and share with FieldRadioRow
const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: "0.75rem",
  outline: "none", // See focus-within
}));

const CheckboxIconBase = styled("div")(({ theme }) => ({
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
}));

const CheckboxIconContainer = styled(CheckboxIconBase)(({ theme }) => ({
  backgroundColor: theme.colors.background.foremost,
  border: `1px dashed ${theme.colors.text.primary}`,
  "& svg": {
    opacity: 0,
    margin: "0 0 2px 1px", // Optical offset for pseudo printing misalignment
  },
  "[data-headlessui-state~='checked'] &": {
    backgroundColor: theme.colors.background.card,
    "& svg": {
      opacity: 1,
    },
    border: "none",
  },
}));
