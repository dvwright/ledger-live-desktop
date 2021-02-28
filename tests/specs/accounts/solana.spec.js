import initialize from "../../common.js";
import addAccount from "../../flows/accounts/addAccount";
import { accountsFlows } from "./flows.js";

describe("solana family", () => {
  initialize("solana-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("solana");
  accountsFlows("solana");
});
