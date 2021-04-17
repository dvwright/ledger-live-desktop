// @flow

import invariant from "invariant";
import React, { useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { Transaction } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { FieldComponentProps } from "~/renderer/components/TransactionConfirm";

import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";

import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";
import WarnBox from "~/renderer/components/WarnBox";
import Box from "~/renderer/components/Box";
import { useSolanaPreloadData } from "@ledgerhq/live-common/lib/families/solana/react";
import { mapDelegationInfo } from "@ledgerhq/live-common/lib/families/solana/logic";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { openURL } from "~/renderer/linking";

import {
  OpDetailsData,
  OpDetailsVoteData,
} from "~/renderer/modals/OperationDetails/styledComponents";
import FormattedVal from "~/renderer/components/FormattedVal";

const Info: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  mb: 4,
  px: 5,
}))`
  text-align: center;
`;

const FieldText = styled(Text).attrs(() => ({
  ml: 1,
  ff: "Inter|Medium",
  color: "palette.text.shade80",
  fontSize: 3,
}))`
  word-break: break-all;
  text-align: right;
  max-width: 50%;
`;

const AddressText = styled(Text).attrs(() => ({
  ml: 1,
  ff: "Inter|Medium",
  color: "palette.text.shade80",
  fontSize: 3,
}))`
  word-break: break-all;
  text-align: right;
  max-width: 50%;
  ${p =>
    p.onClick
      ? `
      cursor: pointer;
    &:hover {
      color: ${p.theme.colors.palette.primary.main};
    }
  `
      : ``}
`;

const onExternalLink = (account, address) => {
  const explorerView = getDefaultExplorerView(account.currency);
  const URL = explorerView && getAddressExplorer(explorerView, address);
  if (URL) openURL(URL);
};

const SolanaDelegateValidatorsField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "solana", "solana transaction");

  const unit = getAccountUnit(mainAccount);

  const { validators } = transaction;
  const { validators: solanaValidators } = useSolanaPreloadData();

  const mappedValidators = mapDelegationInfo(validators || [], solanaValidators, unit);

  return mappedValidators && mappedValidators.length > 0 ? (
    <Box vertical justifyContent="space-between" mb={2}>
      <TransactionConfirmField label={field.label} />
      {mappedValidators.map(({ formattedAmount, validator, address }, i) => (
        <OpDetailsData key={address + i}>
          <OpDetailsVoteData>
            <Box>
              <Text>
                <Trans
                  i18nKey="operationDetails.extra.votesAddress"
                  values={{
                    votes: formattedAmount,
                    name: validator?.name ?? address,
                  }}
                >
                  <Text ff="Inter|SemiBold">{""}</Text>
                  {""}
                  <Text ff="Inter|SemiBold">{""}</Text>
                </Trans>
              </Text>
            </Box>
            <AddressText onClick={() => onExternalLink(mainAccount, address)}>
              {address}
            </AddressText>
          </OpDetailsVoteData>
        </OpDetailsData>
      ))}
    </Box>
  ) : null;
};

const SolanaValidatorNameField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  invariant(transaction.family === "solana", "solana transaction");
  const mainAccount = getMainAccount(account, parentAccount);

  const { validators } = transaction;
  const { validators: solanaValidators } = useSolanaPreloadData();

  const address = validators && validators.length > 0 ? validators[0].address : null;

  const formattedValidator = useMemo(
    () => (address ? solanaValidators.find(v => v.validatorAddress === address) : null),
    [address, solanaValidators],
  );

  return address ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>
        <Text ff="Inter|Medium" fontSize={4}>
          {formattedValidator && formattedValidator.name}
        </Text>
        <br />
        <AddressText
          ff="Inter|Regular"
          fontSize={2}
          onClick={() => onExternalLink(mainAccount, address)}
        >
          {address}
        </AddressText>
      </FieldText>
    </TransactionConfirmField>
  ) : null;
};

const SolanaValidatorAmountField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "solana", "solana transaction");

  const unit = getAccountUnit(mainAccount);

  const { validators } = transaction;

  return validators && validators.length > 0 ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>
        <FormattedVal
          color={"palette.text.shade80"}
          unit={unit}
          val={validators[0].amount}
          fontSize={3}
          showCode
        />
      </FieldText>
    </TransactionConfirmField>
  ) : null;
};

const SolanaSourceValidatorField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  invariant(transaction.family === "solana", "solana transaction");
  const mainAccount = getMainAccount(account, parentAccount);

  const { solanaSourceValidator } = transaction;
  const { validators: solanaValidators } = useSolanaPreloadData();
  const formattedValidator = useMemo(
    () => solanaValidators.find(v => v.validatorAddress === solanaSourceValidator),
    [solanaValidators, solanaSourceValidator],
  );

  return formattedValidator ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>
        <Text ff="Inter|Medium" fontSize={4}>
          {formattedValidator.name}
        </Text>
        <br />
        <AddressText
          ff="Inter|Regular"
          fontSize={2}
          onClick={() => onExternalLink(mainAccount, formattedValidator.validatorAddress)}
        >
          {formattedValidator.validatorAddress}
        </AddressText>
      </FieldText>
    </TransactionConfirmField>
  ) : null;
};

const SolanaMemoField = ({ account, parentAccount, transaction, field }: FieldComponentProps) => {
  invariant(transaction.family === "solana", "solana transaction");

  const { memo } = transaction;

  return memo ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>{memo}</FieldText>
    </TransactionConfirmField>
  ) : null;
};

const Warning = ({
  transaction,
  recipientWording,
}: {
  transaction: Transaction,
  recipientWording: string,
}) => {
  invariant(transaction.family === "solana", "solana transaction");

  switch (transaction.mode) {
    case "delegate":
    case "undelegate":
    case "redelegate":
    case "claimReward":
    case "claimRewardCompound":
      return null;
    default:
      return (
        <WarnBox>
          <Trans i18nKey="TransactionConfirm.warning" values={{ recipientWording }} />
        </WarnBox>
      );
  }
};

const Title = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "solana", "solana transaction");

  return (
    <Info>
      <Trans i18nKey={`TransactionConfirm.titleWording.${transaction.mode}`} />
    </Info>
  );
};

const fieldComponents = {
  "solana.memo": SolanaMemoField,
  "solana.delegateValidators": SolanaDelegateValidatorsField,
  "solana.validatorName": SolanaValidatorNameField,
  "solana.validatorAmount": SolanaValidatorAmountField,
  "solana.sourceValidatorName": SolanaSourceValidatorField,
};

export default {
  fieldComponents,
  warning: Warning,
  title: Title,
  disableFees: () => true,
};
