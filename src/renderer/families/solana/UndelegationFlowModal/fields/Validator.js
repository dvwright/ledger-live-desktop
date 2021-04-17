// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { useSolanaDelegationsQuerySelector } from "@ledgerhq/live-common/lib/families/solana/react";
import type {
  Transaction,
  SolanaMappedDelegation,
} from "@ledgerhq/live-common/lib/families/solana/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: (delegaiton: SolanaMappedDelegation) => void,
};

export default function ValidatorField({ account, transaction, onChange }: Props) {
  const { t } = useTranslation();
  const { query, setQuery, options, value } = useSolanaDelegationsQuerySelector(
    account,
    transaction,
  );

  return (
    <Box mb={4}>
      <Label>{t("solana.undelegation.flow.steps.amount.fields.validator")}</Label>
      <Select
        value={value}
        options={options}
        inputValue={query}
        onInputChange={setQuery}
        renderOption={OptionRow}
        renderValue={OptionRow}
        onChange={onChange}
      />
    </Box>
  );
}

type OptionRowProps = {
  data: SolanaMappedDelegation,
};

function OptionRow({ data: { validatorAddress, validator, formattedAmount } }: OptionRowProps) {
  const name = validator?.name ?? validatorAddress;
  return (
    <Box key={validatorAddress} horizontal alignItems="center" justifyContent="space-between">
      <Box horizontal alignItems="center">
        <FirstLetterIcon label={name} mr={2} />
        <Text ff="Inter|Medium">{name}</Text>
      </Box>
      <Text ff="Inter|Regular">{formattedAmount}</Text>
    </Box>
  );
}
