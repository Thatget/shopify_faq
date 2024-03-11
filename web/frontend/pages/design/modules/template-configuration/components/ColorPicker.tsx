// import {Button, ColorPicker, HSBAColor} from '@shopify/polaris';
import {SyntheticEvent, useState} from 'react';

type ColorPickerProps = {
  label: string
  value: string
  onChange: (value: string) => void
}
export default function ColorPickerDesign(props: ColorPickerProps) {
  // const [color, setColor] = useState(hexToHsb(props.value));
  const [ active, setActive ] = useState(false)
  const [ hexColor ] = useState<string>(props.value)
  // function hsbToHex(h: number, s: number, br: number) {
  //   // Ensure the values are within valid ranges
  //   h = Math.max(0, Math.min(360, h));
  //   s = Math.max(0, Math.min(100, s));
  //   br = Math.max(0, Math.min(100, br));
  
  //   // Convert HSB to RGB
  //   const c = (1 - Math.abs(2 * br - 1)) * s / 100;
  //   const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  //   const m = br - c / 2;
  
  //   let r, g, b;
  //   if (h >= 0 && h < 60) {
  //     r = c;
  //     g = x;
  //     b = 0;
  //   } else if (h >= 60 && h < 120) {
  //     r = x;
  //     g = c;
  //     b = 0;
  //   } else if (h >= 120 && h < 180) {
  //     r = 0;
  //     g = c;
  //     b = x;
  //   } else if (h >= 180 && h < 240) {
  //     r = 0;
  //     g = x;
  //     b = c;
  //   } else if (h >= 240 && h < 300) {
  //     r = x;
  //     g = 0;
  //     b = c;
  //   } else {
  //     r = c;
  //     g = 0;
  //     b = x;
  //   }
  
  //   // Convert RGB to hex
  //   const rgbToHex = (val: number) => {
  //     const hex = Math.round(val * 255).toString(16);
  //     return hex.length === 1 ? '0' + hex : hex;
  //   };
  
  //   const hexColor = `#${rgbToHex(r + m)}${rgbToHex(g + m)}${rgbToHex(b + m)}`;
  //   setHexColor(hexColor.toUpperCase())
  // }

  // function hexToHsb(hex: string) {
  //   // Remove the '#' if present
  //   hex = hex.replace(/^#/, '');
  
  //   // Parse the hex color components
  //   const bigint = parseInt(hex, 16);
  //   const r = (bigint >> 16) & 255;
  //   const g = (bigint >> 8) & 255;
  //   const br = bigint & 255;
  
  //   // Convert RGB to HSB
  //   const max = Math.max(r, g, br);
  //   const min = Math.min(r, g, br);
  //   const delta = max - min;
    
  //   let hue = 120, saturation, brightness;
  
  //   // Calculate brightness
  //   brightness = (max / 255) * 100;
  
  //   // Calculate saturation
  //   saturation = max === 0 ? 0 : (delta / max) * 100;
  
  //   // Calculate hue
  //   if (delta === 0) {
  //     hue = 0; // No change in hue for grayscale colors
  //   } else if (max === r) {
  //     hue = ((g - brightness) / delta + (g < brightness ? 6 : 0)) * 60;
  //   } else if (max === g) {
  //     hue = ((brightness - r) / delta + 2) * 60;
  //   } else if (max === brightness) {
  //     hue = ((r - g) / delta + 4) * 60;
  //   }
  
  //   return { hue, saturation, brightness };
  // }
  
  return (
    <>
      <b>{ props.label }</b>
      <div className='flex justify-between'>
        <div className='border rounded w-[60px] h-[30px] cursor-pointer relative' onClick={() => setActive(!active)} style={{ backgroundColor: hexColor}}>
          { active && 
            <div 
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation();
                setActive(true)
              }} 
              className='absolute top-[-40px] left-[-1px] z-50'
            >
              <div className='flex flex-col p-3 border rounded bg-white justify-center'>
                {/* <ColorPicker 
                  onChange={(color: HSBAColor) => {
                    setColor(color)
                    hsbToHex(color.hue, color.saturation, color.brightness)
                    props.onChange(hexColor)
                  }} 
                  color={color}
                /> */}
                {/* <div
                  className='mt-2 flex justify-end'
                  onClick={(event: SyntheticEvent) => {
                    event.stopPropagation();
                    setActive(false)
                  }}                
                >
                  <Button variant='primary'>Done</Button>
                </div> */}
              </div>
            </div>
          }
        </div>
        <p className='me-1'>{ hexColor }</p>
      </div>
    </>
  );
}