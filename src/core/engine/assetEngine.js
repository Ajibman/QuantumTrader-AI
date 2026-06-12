import { generateSignal } from "./signalEngine";

export function processAsset(asset, marketData, aiOutput) {
  return generateSignal(
    {
      asset,
      ...marketData
    },
    aiOutput
  );
}
