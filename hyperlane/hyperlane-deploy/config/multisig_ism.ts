import { ChainMap, ModuleType, MultisigIsmConfig } from '@hyperlane-xyz/sdk';

export const multisigIsmConfig: ChainMap<MultisigIsmConfig> = {
  // ----------- Your chains here -----------------
  anvil1: {
    type: ModuleType.LEGACY_MULTISIG,
    threshold: 1,
    validators: [
      // Last anvil address
      '0x7b03a162779E86aFAf6423ceCcfC408ace2E71D1',
    ],
  },
  anvil2: {
    type: ModuleType.LEGACY_MULTISIG,
    threshold: 1,
    validators: [
      // Last anvil address
      '0x7b03a162779E86aFAf6423ceCcfC408ace2E71D1',
    ],
  },
  zora: {
    type: ModuleType.LEGACY_MULTISIG,
    threshold: 1,
    validators: ["0x7b03a162779E86aFAf6423ceCcfC408ace2E71D1"]
  }
};
