/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { KarmaToken, KarmaTokenInterface } from "../KarmaToken";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280601d81526020017f4368616b726120477572752044414f202d204b41524d4120546f6b656e0000008152506040518060400160405280600581526020017f4b41524d4100000000000000000000000000000000000000000000000000000081525081600390805190602001906200009692919062000284565b508060049080519060200190620000af92919062000284565b505050620000f233620000c7620000f860201b60201c565b600a620000d5919062000474565b633b9aca00620000e69190620005b1565b6200010160201b60201c565b620006f3565b60006008905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000174576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200016b906200036c565b60405180910390fd5b62000188600083836200027a60201b60201c565b80600260008282546200019c9190620003bc565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254620001f39190620003bc565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200025a91906200038e565b60405180910390a362000276600083836200027f60201b60201c565b5050565b505050565b505050565b828054620002929062000629565b90600052602060002090601f016020900481019282620002b6576000855562000302565b82601f10620002d157805160ff191683800117855562000302565b8280016001018555821562000302579182015b8281111562000301578251825591602001919060010190620002e4565b5b50905062000311919062000315565b5090565b5b808211156200033057600081600090555060010162000316565b5090565b600062000343601f83620003ab565b91506200035082620006ca565b602082019050919050565b620003668162000612565b82525050565b60006020820190508181036000830152620003878162000334565b9050919050565b6000602082019050620003a560008301846200035b565b92915050565b600082825260208201905092915050565b6000620003c98262000612565b9150620003d68362000612565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200040e576200040d6200065f565b5b828201905092915050565b6000808291508390505b60018511156200046b578086048111156200044357620004426200065f565b5b6001851615620004535780820291505b80810290506200046385620006bd565b945062000423565b94509492505050565b6000620004818262000612565b91506200048e836200061c565b9250620004bd7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484620004c5565b905092915050565b600082620004d75760019050620005aa565b81620004e75760009050620005aa565b81600181146200050057600281146200050b5762000541565b6001915050620005aa565b60ff84111562000520576200051f6200065f565b5b8360020a9150848211156200053a57620005396200065f565b5b50620005aa565b5060208310610133831016604e8410600b84101617156200057b5782820a9050838111156200057557620005746200065f565b5b620005aa565b6200058a848484600162000419565b92509050818404811115620005a457620005a36200065f565b5b81810290505b9392505050565b6000620005be8262000612565b9150620005cb8362000612565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156200060757620006066200065f565b5b828202905092915050565b6000819050919050565b600060ff82169050919050565b600060028204905060018216806200064257607f821691505b602082108114156200065957620006586200068e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60008160011c9050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b61125380620007036000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610d19565b60405180910390f35b6100e660048036038101906100e19190610b67565b610308565b6040516100f39190610cfe565b60405180910390f35b61010461032b565b6040516101119190610e1b565b60405180910390f35b610134600480360381019061012f9190610b18565b610335565b6040516101419190610cfe565b60405180910390f35b610152610364565b60405161015f9190610e36565b60405180910390f35b610182600480360381019061017d9190610b67565b61036d565b60405161018f9190610cfe565b60405180910390f35b6101b260048036038101906101ad9190610ab3565b6103a4565b6040516101bf9190610e1b565b60405180910390f35b6101d06103ec565b6040516101dd9190610d19565b60405180910390f35b61020060048036038101906101fb9190610b67565b61047e565b60405161020d9190610cfe565b60405180910390f35b610230600480360381019061022b9190610b67565b6104f5565b60405161023d9190610cfe565b60405180910390f35b610260600480360381019061025b9190610adc565b610518565b60405161026d9190610e1b565b60405180910390f35b60606003805461028590610f4b565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610f4b565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610772565b6103588585856107fe565b60019150509392505050565b60006008905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190610e6d565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610f4b565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610f4b565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610dfb565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fe565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610617576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060e90610ddb565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610687576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067e90610d5b565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107659190610e1b565b60405180910390a3505050565b600061077e8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f857818110156107ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e190610d7b565b60405180910390fd5b6107f784848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561086e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161086590610dbb565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156108de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d590610d3b565b60405180910390fd5b6108e9838383610a7f565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096690610d9b565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610a029190610e6d565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a669190610e1b565b60405180910390a3610a79848484610a84565b50505050565b505050565b505050565b600081359050610a98816111ef565b92915050565b600081359050610aad81611206565b92915050565b600060208284031215610ac557600080fd5b6000610ad384828501610a89565b91505092915050565b60008060408385031215610aef57600080fd5b6000610afd85828601610a89565b9250506020610b0e85828601610a89565b9150509250929050565b600080600060608486031215610b2d57600080fd5b6000610b3b86828701610a89565b9350506020610b4c86828701610a89565b9250506040610b5d86828701610a9e565b9150509250925092565b60008060408385031215610b7a57600080fd5b6000610b8885828601610a89565b9250506020610b9985828601610a9e565b9150509250929050565b610bac81610ed5565b82525050565b6000610bbd82610e51565b610bc78185610e5c565b9350610bd7818560208601610f18565b610be081610fdb565b840191505092915050565b6000610bf8602383610e5c565b9150610c0382610fec565b604082019050919050565b6000610c1b602283610e5c565b9150610c268261103b565b604082019050919050565b6000610c3e601d83610e5c565b9150610c498261108a565b602082019050919050565b6000610c61602683610e5c565b9150610c6c826110b3565b604082019050919050565b6000610c84602583610e5c565b9150610c8f82611102565b604082019050919050565b6000610ca7602483610e5c565b9150610cb282611151565b604082019050919050565b6000610cca602583610e5c565b9150610cd5826111a0565b604082019050919050565b610ce981610f01565b82525050565b610cf881610f0b565b82525050565b6000602082019050610d136000830184610ba3565b92915050565b60006020820190508181036000830152610d338184610bb2565b905092915050565b60006020820190508181036000830152610d5481610beb565b9050919050565b60006020820190508181036000830152610d7481610c0e565b9050919050565b60006020820190508181036000830152610d9481610c31565b9050919050565b60006020820190508181036000830152610db481610c54565b9050919050565b60006020820190508181036000830152610dd481610c77565b9050919050565b60006020820190508181036000830152610df481610c9a565b9050919050565b60006020820190508181036000830152610e1481610cbd565b9050919050565b6000602082019050610e306000830184610ce0565b92915050565b6000602082019050610e4b6000830184610cef565b92915050565b600081519050919050565b600082825260208201905092915050565b6000610e7882610f01565b9150610e8383610f01565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610eb857610eb7610f7d565b5b828201905092915050565b6000610ece82610ee1565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015610f36578082015181840152602081019050610f1b565b83811115610f45576000848401525b50505050565b60006002820490506001821680610f6357607f821691505b60208210811415610f7757610f76610fac565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6111f881610ec3565b811461120357600080fd5b50565b61120f81610f01565b811461121a57600080fd5b5056fea2646970667358221220bd008c5db3432932aa5ed08bde55c605fdeded15751e67f09297b307c4b2b41e64736f6c63430008040033";

export class KarmaToken__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<KarmaToken> {
    return super.deploy(overrides || {}) as Promise<KarmaToken>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): KarmaToken {
    return super.attach(address) as KarmaToken;
  }
  connect(signer: Signer): KarmaToken__factory {
    return super.connect(signer) as KarmaToken__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KarmaTokenInterface {
    return new utils.Interface(_abi) as KarmaTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KarmaToken {
    return new Contract(address, _abi, signerOrProvider) as KarmaToken;
  }
}
