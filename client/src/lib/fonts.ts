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
  h1: 'font-montserrat text-4xl md:text-6xl font-bold text-foreground',
  h2: 'font-montserrat text-3xl md:text-4xl font-bold text-foreground',
  h3: 'font-montserrat text-2xl md:text-3xl font-bold text-foreground',
  h4: 'font-montserrat text-xl md:text-2xl font-semibold text-foreground',
  h5: 'font-montserrat text-lg md:text-xl font-semibold text-foreground',
  subtitle: 'font-pretendard text-lg md:text-xl text-muted-foreground',
};

// Text classes for consistent typography
export const textClasses = {
  paragraph: 'font-pretendard text-base md:text-lg text-muted-foreground',
  small: 'font-pretendard text-sm text-muted-foreground/80',
  label: 'font-montserrat text-sm font-medium text-foreground',
  price: 'font-montserrat font-semibold text-primary',
};

// Button classes for consistent styling
export const buttonClasses = {
  primary: 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat shadow-lg shadow-primary/20',
  secondary: 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat',
  dark: 'bg-background hover:bg-secondary text-foreground font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat border border-border',
  light: 'border border-primary/50 hover:bg-primary/10 text-primary font-medium py-3 px-8 rounded-full text-center transition duration-300 font-montserrat',
};
