import React, { createContext, useContext } from 'react';
import { Harmony } from '@harmony-js/core';
import { getProvider } from '../utils/provider';

type HarmonyroviderProps = { children: React.ReactNode };

const provider = getProvider();
const hmy = new Harmony(provider.url, { chainId: provider.chainId, chainType: provider.chainType });

const HarmonyContext = createContext<Harmony>(hmy);

export const HarmonyProvider = ({ children }: HarmonyroviderProps) => {
    return (
        <HarmonyContext.Provider value={hmy}>
            {children}
        </HarmonyContext.Provider>
    ) 
}

export const useHarmony = () => {
    const context = useContext(HarmonyContext);
    return context
}