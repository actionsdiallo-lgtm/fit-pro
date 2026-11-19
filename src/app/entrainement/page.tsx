import WorkoutPlayer from "@/components/WorkoutPlayer";

export default function Page() {
  return (
    <div style={{ padding: 16, background: "#000", minHeight: "100vh" }}>
      <h1 style={{ color: "#fff", textAlign: "center", fontSize: 26, marginBottom: 16 }}>💪 Entraînement du jour</h1>
      <WorkoutPlayer />
    </div>
  );
}
