export const HexToRGB = (R: string, G: string, B: string) => {
  return { R: parseInt(R, 16), G: parseInt(G, 16), B: parseInt(B, 16) }
}

