// @flow
import React from "react";
import { useSolanaDelegationsQuerySelector } from "@ledgerhq/live-common/lib/families/solana/react";
import type { SolanaMappedDelegation } from "@ledgerhq/live-common/lib/families/solana/types";
import Box from "~/renderer/components/Box";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";

const renderItem = ({
  data: { validatorAddress, validator, formattedPendingRewards, status },
}: {
  data: SolanaMappedDelegation,
}) => {
  const name = validator?.name ?? validatorAddress;
  return (
    <Box key={validatorAddress} horizontal alignItems="center" justifyContent="space-between">
      <Box horizontal alignItems="center">
        <FirstLetterIcon label={name} mr={2} />
        <Text ff="Inter|Medium">{name}</Text>
      </Box>
      <Text ff="Inter|Regular">{formattedPendingRewards}</Text>
    </Box>
  );
};

export default function DelegationSelectorField({ account, transaction, t, onChange }: *) {
  const { query, setQuery, options, value } = useSolanaDelegationsQuerySelector(
    account,
    transaction,
  );

  return (
    <Box flow={1} mt={5}>
      <Label>{t("solana.claimRewards.flow.steps.claimRewards.selectLabel")}</Label>
      <Select
        value={value}
        options={options}
        getOptionValue={({ validatorAddress }) => validatorAddress}
        renderValue={renderItem}
        renderOption={renderItem}
        onInputChange={setQuery}
        inputValue={query}
        filterOption={({ data }) => data.pendingRewards.gt(0)}
        placeholder={t("common.selectAccount")}
        noOptionsMessage={({ inputValue }) =>
          t("common.selectValidatorNoOption", { accountName: inputValue })
        }
        onChange={onChange}
      />
    </Box>
  );
}
