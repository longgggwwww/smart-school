import AnimatedOutlet from "../common/AnimatedOutlet";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <AnimatedOutlet />
    </div>
  );
}
