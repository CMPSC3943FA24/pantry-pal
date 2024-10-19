// /app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href={{ pathname: "./screens" }} />; // Redirect to the actual home screen in the screens folder
}
