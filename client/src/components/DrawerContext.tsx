import { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextType {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const setOpen = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <DrawerContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
