export const setupFonts = () => {
  // This function is called from main.tsx to ensure fonts are loaded
  // No need to add classes manually, as they're handled by TailwindCSS now
};

// Font classes for easy use in components
export const fontClasses = {
  pretendard: 'font-pretendard',
  maruburi: 'font-maruburi',
  montserrat: 'font-montserrat',
  playfair: 'font-playfair',
};

// Heading classes for consistent typography
export const headingClasses = {
  h1: 'font-playfair text-4xl md:text-6xl font-bold',
  h2: 'font-playfair text-3xl md:text-4xl font-bold',
  h3: 'font-playfair text-2xl md:text-3xl font-bold',
  h4: 'font-playfair text-xl md:text-2xl font-semibold',
  h5: 'font-playfair text-lg md:text-xl font-semibold',
  subtitle: 'font-maruburi text-lg md:text-xl text-gray-600',
};

// Text classes for consistent typography
export const textClasses = {
  paragraph: 'font-pretendard text-base md:text-lg',
  small: 'font-pretendard text-sm',
  label: 'font-montserrat text-sm font-medium',
  price: 'font-montserrat font-semibold',
};

// Button classes for consistent styling
export const buttonClasses = {
  primary: 'bg-[#D4AF37] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-md text-center transition duration-300 font-montserrat',
  secondary: 'border border-[#1B1B1B] text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-white font-medium py-3 px-8 rounded-md text-center transition duration-300 font-montserrat',
  dark: 'bg-[#1B1B1B] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-md text-center transition duration-300 font-montserrat',
  light: 'border border-white hover:bg-white hover:text-[#1B1B1B] font-medium py-3 px-8 rounded-md text-center transition duration-300 font-montserrat',
};
