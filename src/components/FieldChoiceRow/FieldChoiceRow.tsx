import type { PropsWithChildren, ReactNode } from "react";
import FieldLabel from "@/components/FieldLabel";
import FieldRow from "@/components/FieldRow";

interface FieldChoiceRowProps {
  control: ReactNode;
}

function FieldChoiceRow({
  control,
  children,
}: PropsWithChildren<FieldChoiceRowProps>) {
  return (
    <FieldRow>
      {control}
      <FieldLabel>{children}</FieldLabel>
    </FieldRow>
  );
}

export default FieldChoiceRow;
