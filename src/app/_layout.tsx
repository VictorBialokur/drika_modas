import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import { initializeDatabase } from "@/database/initializeDatabase";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="drikamodas.db" onInit={initializeDatabase}>
      <SafeAreaProvider>
        <Stack />
      </SafeAreaProvider>
    </SQLiteProvider>
  )
}
