import PuzzleView from "./PuzzleView";

type Props = { params: Promise<{ puzzleId: string }> };

export default async function PuzzlePage({ params }: Props) {
  const { puzzleId } = await params;
  return <PuzzleView puzzleId={puzzleId} />;
}
