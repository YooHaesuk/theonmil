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
  h1: 'font-montserrat text-4xl md:text-6xl font-bold text-white',
  h2: 'font-montserrat text-3xl md:text-4xl font-bold text-white',
  h3: 'font-montserrat text-2xl md:text-3xl font-bold text-white',
  h4: 'font-montserrat text-xl md:text-2xl font-semibold text-white',
  h5: 'font-montserrat text-lg md:text-xl font-semibold text-white',
  subtitle: 'font-pretendard text-lg md:text-xl text-gray-300',
};

// Text classes for consistent typography
export const textClasses = {
  paragraph: 'font-pretendard text-base md:text-lg text-gray-300',
  small: 'font-pretendard text-sm text-gray-400',
  label: 'font-montserrat text-sm font-medium text-white',
  price: 'font-montserrat font-semibold text-white',
};

// Button classes for consistent styling
export const buttonClasses = {
  primary: 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] hover:opacity-90 text-white font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat',
  secondary: 'border border-[#333333] bg-[#111111] text-white hover:bg-[#1A1A2A] font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat',
  dark: 'bg-[#111111] hover:bg-[#1A1A2A] text-white font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat',
  light: 'border border-[#333333] hover:bg-[#1A1A2A] text-white font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat',
};
