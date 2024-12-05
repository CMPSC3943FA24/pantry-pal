// /app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This will redirect to the screens folder */}
      <Stack.Screen
        name="index" // Root index should handle redirects
        options={{
          headerShown: false, // No header for redirect page
        }}
      />
    </Stack>
  );
}
