import { View, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "@/components/global/Logo";

import logo from "@/assets/images/logo.png";
import translateCommonStyles from '@/styles/translateCommonStyles';

interface TranslateBaseProps {
  children?: React.ReactNode;
}

export default function TranslateBase({ children }: TranslateBaseProps) {
  return (
    <SafeAreaView style={translateCommonStyles.container}>
      <Logo style={translateCommonStyles.logo} />
      {children}
    </SafeAreaView>
  );
}