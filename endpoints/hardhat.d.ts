/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "AccessControlEnumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControlEnumerable__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "IAccessControlEnumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlEnumerable__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "ChakraToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ChakraToken__factory>;
    getContractFactory(
      name: "KarmaToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KarmaToken__factory>;
    getContractFactory(
      name: "KarmaPrivateCrowdsale",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KarmaPrivateCrowdsale__factory>;
    getContractFactory(
      name: "KarmaPrivateSaleVestingVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KarmaPrivateSaleVestingVault__factory>;
    getContractFactory(
      name: "CrowdsaleBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CrowdsaleBase__factory>;
    getContractFactory(
      name: "CrowdsaleMeta",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CrowdsaleMeta__factory>;
    getContractFactory(
      name: "CrowdsalePostDelivery",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CrowdsalePostDelivery__factory>;
    getContractFactory(
      name: "CrowdsaleRefundable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CrowdsaleRefundable__factory>;
    getContractFactory(
      name: "CrowdsaleCapped",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CrowdsaleCapped__factory>;
    getContractFactory(
      name: "CrowdsaleLimitter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CrowdsaleLimitter__factory>;
    getContractFactory(
      name: "CrowdsaleTime",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CrowdsaleTime__factory>;
    getContractFactory(
      name: "VestingVaultAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VestingVaultAccessControl__factory>;
    getContractFactory(
      name: "VestingVaultBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VestingVaultBase__factory>;
    getContractFactory(
      name: "VestingVaultMeta",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VestingVaultMeta__factory>;

    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "AccessControlEnumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlEnumerable>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "IAccessControlEnumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlEnumerable>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "ChakraToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ChakraToken>;
    getContractAt(
      name: "KarmaToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KarmaToken>;
    getContractAt(
      name: "KarmaPrivateCrowdsale",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KarmaPrivateCrowdsale>;
    getContractAt(
      name: "KarmaPrivateSaleVestingVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KarmaPrivateSaleVestingVault>;
    getContractAt(
      name: "CrowdsaleBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CrowdsaleBase>;
    getContractAt(
      name: "CrowdsaleMeta",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CrowdsaleMeta>;
    getContractAt(
      name: "CrowdsalePostDelivery",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CrowdsalePostDelivery>;
    getContractAt(
      name: "CrowdsaleRefundable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CrowdsaleRefundable>;
    getContractAt(
      name: "CrowdsaleCapped",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CrowdsaleCapped>;
    getContractAt(
      name: "CrowdsaleLimitter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CrowdsaleLimitter>;
    getContractAt(
      name: "CrowdsaleTime",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CrowdsaleTime>;
    getContractAt(
      name: "VestingVaultAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VestingVaultAccessControl>;
    getContractAt(
      name: "VestingVaultBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VestingVaultBase>;
    getContractAt(
      name: "VestingVaultMeta",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VestingVaultMeta>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
