import { GameSelection } from "@/components/game-selection";

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-darkBlue to-cyber-darker relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GameSelection />
      </div>
    </div>
  );
}
