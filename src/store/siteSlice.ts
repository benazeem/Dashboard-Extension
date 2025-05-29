import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SiteItem {
    id: string;
    name: string;
    url: string;
    icon: string;
    bgColor?: string; // Optional, for background color
    x: number; // Optional, for positioning gridColumnStart
    y: number; // Optional, for positioning gridRowStart
    width: 1;
    height: 1;
    parent: string; // Optional, for parent area (e.g., "dock", "main", "page-1", etc.)
    type: "site";
  }


  interface SiteItemState {
    items: SiteItem[];
    mergePreview: {
      [siteId: string]: string[];
    },
  }

  const initialState: SiteItemState = {
    items: [{id: "bookmark-1", name: "Facebook", url: "https://www.google.com", type:"site", parent: "home", x:1, y:0,  width: 1, height: 1, icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAhRJREFUeF7tmjFOA0EQBMcZ3+ElpORIiCcREZMS8QwCHkJGaiRHCHFyB+emFhXx6Lap2t41Zw5X98fj+IMhcFAIxsUpiEJYPhQC86EQhdAIwPJ4hygERgAWx4YoBEYAFseGKARGABbHhigERgAWx4YoBEYAFseGKARGABbHhigERgAWx4YoBEYAFgfVkOeHmZvrPqGPz5m7p5nX9/7aP1dUyMwoZGMj2hDYvwEpRCGnrnpkeWRtfnrwUrch2x8tvUMWvENe3mZuH//+74VLJVjuyFLIpbbCL89NjiyFKKRIwDukCjtZzDskoVScUUgRdrKUQhJKxRmFFGEnSykkoVScWU7IXmxIb3i//04KAXxtqxDYG16FKCQ7+ZN3WdmTzk95h5xnNApZ8F1W4DUasSEBJhuyYEP8PiTY2XuNJA1RyF60g+coxCMr2CbdkeVenXhkFTeIR5ZHVnG7ZUt5ZGWcalMKqaHOFlJIxqk2pZAa6mwhhWScalMKqaHOFlJIxqk2pZAa6mwhhWScalMKqaHOFlJIxqk2pZAa6mwhlJAs8v+eUgjMr0IUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0NgQr4AGPfGpEbRSngAAAAASUVORK5CYII="},
      {id:"bookmark-2", name: "Google", url: "https://www.google.com", type:"site", parent: "home",  x:0, y:0,  width: 1, height: 1, icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAABrpJREFUeF7tnFtIVU0Ux5eEECUGIVSgBolWUEh5D8yohxCVoqwQw/CCinjDC2gRvoSGFRiFGnaj7MEumkSRD0UJRibZg93FB4swDTXLIKjw4z8g+Mk5e4+nfc5ecdY8z5695v/ba9Zc1myfmZmZGZLCRgEfAcKGhTJEgPDiIUCY8RAgAoSbAszskRgiQJgpwMwc8RABwkwBZuaIhwgQZgowM0c8RIAwU4CZOeIhAoSZAszMEQ8RIMwUYGaOeIgAYaYAM3PEQwSI6wr8+vWLhoaG6MGDB/T8+XN69eoVTU5O0uDg4P8aDQoKolWrVtGKFSsoOjqa4uPjKSIigvz8/Fx/uYeeZO8hSIp5//49NTY20vXr1+nz588uSQMYgJKfn08pKSm0dOlSl9px90Osgbx7947Ky8vp7t27luqwZs0a1W5WVhYtXrzY0rb/tjGWQH78+EHHjx+nM2fO0NTU1N/20enz27Zto3PnzlFYWJjb3rHQhtkBwfCUl5dHjx49WmhfXKq/fv16ampqooSEBJeet/ohVkBevHhBhw4dooGBAav7adgeoLS2ttLmzZs9+l5HL2MDpL+/nw4ePEhv3ryxRZStW7cqKJih2VlYAPn48aOC0d3dbacWaqhE3PL19bXNDtuBYG1RVFSkgqtuWblyJW3fvp12795NcXFxar0xKyLaGx0dpcePH9PVq1epp6eHpqentZoOCAigy5cvU1JSklZ9d1SyHciNGzfU9FNHtGXLllFhYSGVlZXR8uXLTfXAGub169dqitvV1WVaHxXS09Pp/Pnztk2HbQUyNjZGBw4c0JpRYcXd3NxMmzZt0hJ2biVMo6uqqujs2bOmz65evZrwkURFRZnWdUcFW4FcvHiRsrOzTftlRcD9+fOngnL69GnT99XW1lJ1dbVpPXdUsA2IrndYOSX98OEDpaWl0ZMnTwy1hNfiY1myZIk7NDds0zYg9+/fp3379hnGDuw/YZjB2sSqgvYwiZhbEJsiIyNpx44dBG8MDw+3bSPSFiAItgjMDQ0NhjpjtnPlyhWtAK4LDDsBGCZDQ0MJWyfYCQ4ODqZFixbpNuHWerYAGRkZoT179tDTp08NO3fhwgU1A/OmYgsQgEhNTaVPnz451XrDhg1069YtVht/nvgwbAGCYcgsLgDYpUuXbBvLPSG+o3fYAqSiooJOnTpl2Gcs5k6ePGmXLra91+NAsB7AnhG8xKhgTwmrcm8rHgeCLZLMzEy6efOmodaYFu/cudPbeHj+Fi42/nbt2kW9vb0CxIECHvcQdwHR9Txdl7NryBQgTggJkHnCLDSGiIfo+v68euPj47R//356+PChpTFEgLgIRFc4ZIIgqU236Lar257XDFm/f/+mgoICamlpMdRmoWcSAkT3U3NQr66ujg4fPmzYQkZGhjpn180sFCB/AQSLQpyFGJXY2Fhqb29XSdM6RYDoqOSkzsuXL2nv3r0qidpZQQZIW1ubyi6xujg6pJr/Dq+JIej4169fVXbHvXv3DLXGsHbs2DHy8fGxlIkAcTGObNy4UV1BWLdunQCxVAEHjfX19ak4Mjw8bPiq0tJSqq+vtzSbUDzEgeTYhs/JyaFr164ZAkGWIqbIycnJln0jAsSJlB0dHYTprVnWopVXBr5//06VlZWmqateFdRn+UxMTCggOjekkJWOE0QMc64E+T9//lBnZycdOXKE3r59a+ptXgkEqmATEQdWOncHkaeFJLajR48SUj51CtJI79y5o1KOzM5g5rbntUCQrY6v9sSJEzr6qjpIbEtMTFSpRPOz3xGbvnz5olKMbt++rTYxdWB79Tpkfue/fftGubm5aiHIpXith8wC4HJpB/bg44DH+vv7e/z78PiJoVEPsZWCeGKWDO0ulTAU1tTUqGwXu25RsQICoXHmXlJS4vHhC3nEyBVbu3atu3hrtcsOCKxGoMdiEHfVMZS5s8TExKi7IFh4cki4ZglkFgC8BRdskFLqykzJGUhMn3Evvbi4WF1B4ABi1lbWQOYuILHJiGvLuMTpasG/TrAQxXQ5MDDQ1Wbc+tw/AWSuAljd40471hnPnj1TGfT4Q9DcX3Bg/wuCh4SEqB/ObNmyxdZLOAsh+M8BWUjn/sW6AoQZNQEiQJgpwMwc8RABwkwBZuaIhwgQZgowM0c8RIAwU4CZOeIhAoSZAszMEQ8RIMwUYGaOeIgAYaYAM3PEQwQIMwWYmSMeIkCYKcDMHPEQAcJMAWbmiIcIEGYKMDNHPESAMFOAmTniIQKEmQLMzBEPESDMFGBmjniIAGGmADNz/gOy8iwR9R4XpwAAAABJRU5ErkJggg=="},
      {id: "bookmark-3", name: "Facebook", url: "https://www.google.com", type:"site", parent: "home", x:2, y:0,  width: 1, height: 1, icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAhRJREFUeF7tmjFOA0EQBMcZ3+ElpORIiCcREZMS8QwCHkJGaiRHCHFyB+emFhXx6Lap2t41Zw5X98fj+IMhcFAIxsUpiEJYPhQC86EQhdAIwPJ4hygERgAWx4YoBEYAFseGKARGABbHhigERgAWx4YoBEYAFseGKARGABbHhigERgAWx4YoBEYAFgfVkOeHmZvrPqGPz5m7p5nX9/7aP1dUyMwoZGMj2hDYvwEpRCGnrnpkeWRtfnrwUrch2x8tvUMWvENe3mZuH//+74VLJVjuyFLIpbbCL89NjiyFKKRIwDukCjtZzDskoVScUUgRdrKUQhJKxRmFFGEnSykkoVScWU7IXmxIb3i//04KAXxtqxDYG16FKCQ7+ZN3WdmTzk95h5xnNApZ8F1W4DUasSEBJhuyYEP8PiTY2XuNJA1RyF60g+coxCMr2CbdkeVenXhkFTeIR5ZHVnG7ZUt5ZGWcalMKqaHOFlJIxqk2pZAa6mwhhWScalMKqaHOFlJIxqk2pZAa6mwhhWScalMKqaHOFlJIxqk2pZAa6mwhlJAs8v+eUgjMr0IUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0MUAiMAi2NDFAIjAItjQxQCIwCLY0NgQr4AGPfGpEbRSngAAAAASUVORK5CYII="},
      {id:"bookmark-4", name: "Google", url: "https://www.google.com", type:"site", parent: "home", x:3, y:0,  width: 1, height: 1, icon:"data:image/png;base64,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"},
    ],
    mergePreview: {},
};

const siteSlice = createSlice({
  name: "siteItems",
  initialState,
  reducers: {
    addSite: (state, action: PayloadAction<SiteItem>) => {
      state.items.push(action.payload);
    },
    removeSite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateSite: (state, action: PayloadAction<SiteItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setMergePreview: (
      state,
      action: PayloadAction<{ id: string; icons: string[] | null }>
    ) => {
      const { id, icons } = action.payload;
      if (icons === null) {
        delete state.mergePreview[id];
      } else {
        state.mergePreview[id] = icons;
      }
    },
  },
});

export const { addSite, removeSite, updateSite,setMergePreview } = siteSlice.actions;
export default siteSlice.reducer;