import { GameSelection } from "@/components/game-selection";

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <GameSelection />
      </div>
    </div>
  );
}
