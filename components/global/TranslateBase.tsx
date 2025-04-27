import { View, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import LanguageSwitcher from '@/components/translate/LanguageSwitcher';

import logo from "@/assets/images/logo.png";
import translateCommonStyles from '@/styles/translateCommonStyles';

interface TranslateBaseProps {
  children?: React.ReactNode;
}

export default function TranslateBase({ children }: TranslateBaseProps) {
  return (
    <SafeAreaView style={translateCommonStyles.container}>
      <Image source={logo} style={translateCommonStyles.logo} />
      {children}
    </SafeAreaView>
  );
}